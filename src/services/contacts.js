import { Contact } from '../db/models/contact.js';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

const uploadToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const writeStream = cloudinary.uploader.upload_stream(
      { folder: "contacts" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    
    const readStream = Readable.from(buffer);
    readStream.pipe(writeStream);
  });
};

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite,
    userId
}) => {
  const skip = (page - 1) * perPage;
  
  const filter = { userId };
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
    totalPages: totalPages || 1,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages
  };
};

export const getContactById = async (contactId, userId) => {
  return Contact.findOne({_id: contactId, userId });
};

export const createContact = async (payload, file) => {
  let photoUrl;
  
  if (file) {
    const result = await uploadToCloudinary(file.buffer);
    photoUrl = result.secure_url;
  }
  
  const contact = await Contact.create({
    name: payload.name,
    phoneNumber: payload.phoneNumber,
    email: payload.email,
    photo: photoUrl,
    contactType: payload.contactType,
    isFavourite: payload.isFavourite,
    userId: payload.userId
  });

  return contact;
};


export const deleteContact = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({
    _id: contactId,
    userId,
  });

  return contact;
};

export const updateContact = async (contactId, payload, userId, file, options = {}) => {
  let updateData = { ...payload };
  
  if (file) {
    const result = await uploadToCloudinary(file.buffer);
    updateData.photo = result.secure_url;
  }

  const document = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
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