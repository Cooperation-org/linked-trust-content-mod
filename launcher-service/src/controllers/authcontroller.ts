import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db';
const jwt = require('jsonwebtoken');
import { SiweMessage } from 'siwe';

export const createNonce = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { address } = req.body;

  try {
    // Check if a nonce already exists for this address
    const existingNonce = await prisma.nonce.findUnique({
      where: { address: address },
    });
    if (existingNonce) {
      // Delete the existing nonce
      await prisma.nonce.delete({ where: { address: address } });
    }
    // Generate a random nonce
    const nonce = Math.floor(Math.random() * 1000000000).toString();

    // Save the nonce and address to the database
    const savedNonce = await prisma.nonce.create({
      data: {
        address,
        nonce,
      },
    });

    res.status(200).json({ nonce: savedNonce.nonce });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating nonce.' });
  }
};

export const renewToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the refresh token from the request body
    const refreshToken = req.body.refreshToken;

    // Verify the refresh token and extract the payload
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Check if the payload contains the necessary data
    if (!decoded.id || !decoded.role) {
      return res.status(400).send({ message: 'Invalid refresh token.' });
    }

    // Generate a new access token using the payload from the refresh token
    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).send({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error renewing token.' });
  }
};

// Login endpoint for job creator and worker
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message, signature, role } = req.body;
    const siweMessage = new SiweMessage(message);

    const fields = await siweMessage.validate(signature);
    const address = fields.address;
    // Get the saved nonce for the given address from the database
    const nonceRecord = await prisma.nonce.findUnique({
      where: { address },
    });
    if (!nonceRecord) {
      // If nonce doesn't exist for the addres return 401
      return res
        .status(401)
        .send({ message: 'Unauthorized. Please try again.' });
    }
    if (fields.nonce !== nonceRecord.nonce)
      return res.status(422).json({ message: 'Invalid nonce.' });

    let user;
    let isAdmin: boolean | any = false;
    if (role === 'jobCreator') {
      user = await prisma.jobCreator.findUnique({
        where: { address },
      });

      if (!user) {
        user = await prisma.jobCreator.create({ data: { address } });
      }
      isAdmin = user.isAdmin;
    } else if (role === 'worker') {
      user = await prisma.worker.findUnique({ where: { address } });

      if (!user) {
        user = await prisma.worker.create({ data: { address } });
      }
    } else {
      return res
        .status(401)
        .send({ message: 'Unauthorized. Please try again.' });
    }

    if (!user) {
      return res.status(500).json({ message: 'Internal server error' });
    }

    // Generate a new JWT token with the user ID and role

    let payload: object = {
      id: user.id,
      role: role,
    };

    if (isAdmin) payload = { ...payload, isAdmin: isAdmin };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '5m', // Expires in 5 min
    });

    res.status(200).send({ message: 'Login successful.', token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error logging in.' });
  }
};
