const dotenv = require("dotenv");
dotenv.config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const uploadToSupabase = async (file, userId, type) => {
  const filePath = `${type}/${userId}-${Date.now()}-${file.originalname}`;

  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false, // Prevent overwriting existing files
    });

  if (error) {
    console.error("Supabase Upload Error:", error); // Log detailed error
    throw new Error(error.message);
  }

  return `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/${filePath}`;
};

const deleteFromSupabase = async (fileUrl) => {
  const filePath = fileUrl.replace(
    `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/`,
    ""
  ); // Simplified path extraction
  const { error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .remove([filePath]);
  if (error) {
    console.error("Error deleting file from Supabase:", error);
    throw new Error("Failed to delete file from Supabase");
  }
};

module.exports = { deleteFromSupabase, uploadToSupabase };
