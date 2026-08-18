import { Check, Settings, Droplets, Shield, Package } from 'lucide-react';
import { useState } from 'react';

const tasks = [
  { text: 'Verify UV Sterilizer Lamp Operation', icon: Settings },
  { text: 'Record Opening Product Water TDS', icon: Droplets },
  { text: 'Inspect Washing & Sanitizing Station', icon: Shield },
  { text: 'Check Empty Container Physical Inventory', icon: Package },
];

export default function Checklist() {
  const [checkedItems, setCheckedItems] = useState(new Set());

  const toggleItem = (index) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  const progressPercentage = Math.round((checkedItems.size / tasks.length) * 100);
  const strokeDashoffset = 126 - (126 * progressPercentage) / 100;

  return (
    <section id="checklist" className="bg-blue-300 py-24 border-t border-sky-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

          <div className="lg:col-span-5">
            <div className="sticky top-24">


              <h3 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                Daily Station <br className="hidden lg:block"/>
                <span className="text-blue-800 bg-clip-text">
                  Checklist
                </span>
              </h3>

              <p className="text-lg text-gray-700 leading-relaxed mb-10 max-w-lg">
                Complete mandatory safety and system verifications before starting refilling lines. Your shift operations unlock automatically upon 100% completion.
              </p>

              <div className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white rounded-3xl shadow-sm border border-sky-100 max-w-sm">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 50 50">
                    <circle className="text-slate-100 stroke-current" strokeWidth="4" fill="transparent" r="20" cx="25" cy="25" />
                    <circle
                      className="text-sky-500 stroke-current transition-all duration-1000 ease-out"
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="transparent"
                      r="20" cx="25" cy="25"
                      style={{ strokeDasharray: 126, strokeDashoffset }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-slate-800">{progressPercentage}%</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Progress</h4>
                  <p className="text-sm text-slate-500">{checkedItems.size} of {tasks.length} tasks done</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-5">
            {tasks.map((task, index) => {
              const isChecked = checkedItems.has(index);
              const Icon = task.icon;
              return (
                <div
                  key={index}
                  onClick={() => toggleItem(index)}
                  className={`group relative flex items-center p-4 sm:p-6 rounded-3xl cursor-pointer transition-all duration-500 overflow-hidden ${
                    isChecked
                      ? 'bg-slate-200/50 border border-transparent shadow-inner'
                      : 'bg-white border border-sky-100 shadow-md hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  {!isChecked && (
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  )}

                  <div className="relative z-10 flex items-center flex-1 gap-4 sm:gap-5">
                    <div className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl transition-all duration-500 ${
                      isChecked ? 'bg-slate-300/50 text-slate-400' : 'bg-sky-100 text-sky-600 group-hover:scale-110 group-hover:rotate-3'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1">
                      <span className={`text-sm sm:text-lg font-semibold transition-all duration-500 ${
                        isChecked ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-800 group-hover:text-sky-900'
                      }`}>
                        {task.text}
                      </span>
                    </div>

                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-500 ${
                      isChecked
                        ? 'border-sky-500 bg-sky-500'
                        : 'border-slate-300 bg-white group-hover:border-sky-400'
                    }`}>
                      <Check className={`w-4 h-4 text-white transition-all duration-500 ${isChecked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}