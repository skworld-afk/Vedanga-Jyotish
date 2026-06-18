'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

// Import your actual shared Prisma instance here!
// Using relative path to match your project structure
import prisma from '../../src/lib/prisma';

const SECRET = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || 'super-secret-admin-key');

export async function adminSignup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const existingAdmin = await prisma.admin.findUnique({ where: { email } });
  if (existingAdmin) {
    return { error: 'Admin already exists' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
      isApproved: false, // Requires manual DB approval
    },
  });

  return { success: 'Signup successful! Please wait for the super-admin to approve your account in the database.' };
}

export async function adminLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const admin = await prisma.admin.findUnique({ where: { email } });
  
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return { error: 'Invalid credentials' };
  }

  if (!admin.isApproved) {
    return { error: 'Your account has not been approved yet. Contact the super-admin.' };
  }

  // Create JWT Session
  const token = await new SignJWT({ adminId: admin.id, email: admin.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d')
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  redirect('/admin/dashboard');
}

export async function verifyAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!token) redirect('/admin/login');

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { adminId: string; email: string };
  } catch (err) {
    redirect('/admin/login');
  }
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/admin/login');
}

export async function deleteUserAction(formData: FormData) {
  await verifyAdminSession(); // Ensure only admins can perform this action

  const userId = formData.get('userId') as string;
  if (!userId) return;

  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    revalidatePath('/admin/dashboard');
  } catch (error) {
    console.error("Failed to delete user:", error);
  }
}

export async function deleteProfileAction(formData: FormData) {
  await verifyAdminSession(); // Ensure only admins can perform this action

  const profileId = formData.get('profileId') as string;
  if (!profileId) return;

  try {
    await prisma.profile.delete({
      where: { id: profileId },
    });
    revalidatePath('/admin/dashboard');
  } catch (error) {
    console.error("Failed to delete profile:", error);
  }
}

export async function deleteMultipleUsersAction(formData: FormData) {
  await verifyAdminSession(); // Ensure only admins can perform this action

  const userIds = formData.getAll('userIds') as string[];
  if (!userIds || userIds.length === 0) return;

  try {
    await prisma.user.deleteMany({
      where: { id: { in: userIds } },
    });
    revalidatePath('/admin/dashboard');
  } catch (error) {
    console.error("Failed to delete multiple users:", error);
  }
}

export async function deleteMultipleProfilesAction(formData: FormData) {
  await verifyAdminSession(); // Ensure only admins can perform this action

  const profileIds = formData.getAll('profileIds') as string[];
  if (!profileIds || profileIds.length === 0) return;

  try {
    await prisma.profile.deleteMany({
      where: { id: { in: profileIds } },
    });
    revalidatePath('/admin/dashboard');
  } catch (error) {
    console.error("Failed to delete multiple profiles:", error);
  }
}

export async function deleteVisitorAction(formData: FormData) {
  await verifyAdminSession(); // Ensure only admins can perform this action

  const visitorId = formData.get('visitorId') as string;
  if (!visitorId) return;

  try {
    await prisma.visitor.delete({
      where: { id: visitorId },
    });
    revalidatePath('/admin/dashboard');
  } catch (error) {
    console.error("Failed to delete visitor:", error);
  }
}

export async function deleteMultipleVisitorsAction(formData: FormData) {
  await verifyAdminSession(); // Ensure only admins can perform this action

  const visitorIds = formData.getAll('visitorIds') as string[];
  if (!visitorIds || visitorIds.length === 0) return;

  try {
    await prisma.visitor.deleteMany({
      where: { id: { in: visitorIds } },
    });
    revalidatePath('/admin/dashboard');
  } catch (error) {
    console.error("Failed to delete multiple visitors:", error);
  }
}