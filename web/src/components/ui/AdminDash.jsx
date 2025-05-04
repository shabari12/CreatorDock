import React from "react";

const AdminDash = () => {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        {/* First Row: YouTube Data */}
        <div className="flex gap-2">
          {[...new Array(4)].map((_, idx) => (
            <div
              key={"youtube-data-" + idx}
              className="h-20 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center"
            >
              <p className="text-gray-600 dark:text-gray-400">
                YouTube Data {idx + 1}
              </p>
            </div>
          ))}
        </div>

        {/* Second Row: Editor Profile and Add Editor */}
        <div className="flex flex-1 gap-2">
          <div className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800 p-4 flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Editor Profile
            </h2>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Add Editor
            </button>
            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
              <li>Editor 1</li>
              <li>Editor 2</li>
              <li>Editor 3</li>
            </ul>
          </div>
          <div className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800 p-4 flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-400">
              Wait Listed Videos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDash;
