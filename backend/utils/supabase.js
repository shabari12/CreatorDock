require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const uploadToSupabase = async (file, userId, type) => {
  const filePath = `${type}/${userId}-${Date.now()}-${file.originalname}`;

  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .upload(filePath, file.buffer, { contentType: file.mimetype });

  if (error) throw new Error(error.message);

  return `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/${filePath}`;
};

module.exports = { uploadToSupabase };
