import { Contact } from '../db/models/contact.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite
}) => {
  const skip = (page - 1) * perPage;
  
  const filter = {};
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite;

  const [contacts, total] = await Promise.all([
    Contact.find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(perPage),
    Contact.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / perPage);

  return {
    data: contacts,
    page: Number(page),
    perPage: Number(perPage),
    totalItems: total,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages
  };
};

export const getContactById = async (contactId) => {
  return Contact.findById(contactId);
};

export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

export const deleteContact = async (contactId) => {
  const contact = await Contact.findOneAndDelete({
    _id: contactId,
  });

  return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const document = await Contact.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      ...options,
    },
  );

  if (!document) return null;

  return {
    contact: document,
    isNew: options.upsert && !await Contact.exists({ _id: contactId })
  };
};