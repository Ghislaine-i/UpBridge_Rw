/** Map a DB user row (snake_case) to API shape (camelCase). */
const formatUser = (user) => {
  if (!user) return null;
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatar_url,
    headline: user.headline,
    bio: user.bio,
    phone: user.phone,
    location: user.location,
    isActive: user.is_active,
    createdAt: user.created_at,
  };
};

module.exports = { formatUser };
