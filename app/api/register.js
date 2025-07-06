// app/api/register/route.js
import { connectToDatabase } from '@/lib/mongodb'; // @/ = root, if using aliases
import User from '@/models/User';

export async function POST(req) {
  const body = await req.json();
  const { firstName, lastName, email, phone } = body;

  if (!firstName || !lastName || !email || !phone) {
    return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
  }

  if (!email.toLowerCase().includes('@gmail.com')) {
    return new Response(JSON.stringify({ error: 'Only Gmail addresses are allowed' }), { status: 400 });
  }

  if (!/^\d{10}$/.test(phone)) {
    return new Response(JSON.stringify({ error: 'INVALID_PHONE' }), { status: 400 });
  }

  try {
    await connectToDatabase();
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'EMAIL_EXISTS' }), { status: 409 });
    }

    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim()
    });

    await newUser.save();

    return new Response(JSON.stringify({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone
      }
    }), { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ error: 'SERVER_ERROR' }), { status: 500 });
  }
}
