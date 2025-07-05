import { getAllContacts, getContactById } from '../services/contacts.js';
import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';

export const getContactsController = async (req, res) => {
  const { page, perPage, sortBy, sortOrder, type, isFavourite } = req.query;
  const {_id: userId } = req.user;

  const contacts = await getAllContacts({
    page: Number(page),
    perPage: Number(perPage),
    sortBy,
    sortOrder,
    type,
    isFavourite: isFavourite === 'true' ? true : isFavourite === 'false' ? false : undefined,
    userId
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const {_id: userId } = req.user;
  const contact = await getContactById(contactId, userId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const {_id: userId } = req.user;
  const contact = await createContact(
    {...req.body, userId},
    req.file
  );

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const {_id: userId } = req.user;

  const contact = await deleteContact(contactId, userId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};

export const upsertContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const {_id: userId } = req.user;

  const result = await updateContact(contactId, req.body,  userId,{
    upsert: true,
  });

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted a contact!`,
    data: result.contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const {_id: userId } = req.user;
  const result = await updateContact(
    contactId,
    req.body,
    userId,
    req.file
  );

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};