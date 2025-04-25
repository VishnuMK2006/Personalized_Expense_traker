import React from "react";
import { LuX } from "react-icons/lu";

const Model = ({ children, isOpen, onClose, title, size = "max-w-2xl" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`relative w-full ${size} max-h-[90vh] overflow-hidden`}>
        <div className="relative bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {title}
            </h3>
            <button
              className="text-gray-400 hover:text-gray-500 transition-colors"
              onClick={onClose}
            >
              <LuX size={20} />
            </button>
          </div>

          <div className="p-4 overflow-y-auto max-h-[calc(90vh-4rem)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Model;
