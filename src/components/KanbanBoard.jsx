import React from "react";

const KanbanBoard = () => {
  const columns = [
    { id: 1, title: "To Do", items: ["Task 1", "Task 2"] },
    { id: 2, title: "In Progress", items: ["Task 3"] },
    { id: 3, title: "Done", items: ["Task 4"] },
  ];

  return (
    <div className="flex gap-4 p-4 overflow-x-auto scroll-smooth md:justify-start">
      {columns.map((col) => (
        <div
          key={col.id}
          className="flex-shrink-0 w-56 sm:w-64 md:w-64 lg:w-72 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 flex flex-col gap-2 hover:scale-[1.02] transition-transform"
        >
          <h2 className="text-center font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {col.title}
          </h2>
          <div className="flex flex-col gap-2 min-h-[50px]">
            {col.items.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-700 rounded-lg p-3 cursor-grab active:cursor-grabbing active:scale-[1.03] active:bg-gray-200 dark:active:bg-gray-600 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
