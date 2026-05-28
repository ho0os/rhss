import React from "react";
import { ArrowRight, Sparkles, Heart } from "lucide-react";
import { ViewState } from "../types";

interface AppInfoScreenProps {
  onBack: () => void;
}

export default function AppInfoScreen({ onBack }: AppInfoScreenProps) {
  return (
    <div className="pb-24 pt-6 px-5 bg-[#f8f9fa] min-h-screen text-[#191c1d] flex flex-col justify-between animate-fade-in text-right">
      {/* Top Navigation */}
      <div>
        <div className="flex items-center justify-between mb-8 flex-row-reverse border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5 flex-row-reverse">
            <div className="w-9 h-9 bg-blue-50 text-[#1e3a8a] rounded-xl flex items-center justify-center border border-blue-100/50">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-gray-800">معلومات التطبيق</h2>
          </div>
          
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 text-gray-600 shadow-sm transition-transform active:scale-95 border border-gray-100"
            title="رجوع"
          >
            <ArrowRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Central Display Card */}
        <div className="space-y-6 mt-12">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg relative overflow-hidden flex flex-col items-center justify-center text-center">
            
            {/* Visual background ornament blobs */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Icon Banner */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1e3a8a] to-blue-600 text-white flex items-center justify-center mb-6 shadow-md shadow-blue-500/10">
              <Sparkles className="w-8 h-8 animate-pulse text-white" />
            </div>

            {/* App title */}
            <h3 className="text-lg font-extrabold text-[#1e3a8a] mb-2 font-sans">
              نظام تنظيم شؤون الموظفين الذكي
            </h3>
            <span className="text-[10px] font-mono text-gray-400 font-bold tracking-wider bg-gray-50 px-2.5 py-1 rounded-full border border-gray-150 mb-6">
              V 2.1.0 • مستقر
            </span>

            {/* Requested exact text with majestic typography */}
            <p className="text-sm font-bold text-gray-700 leading-relaxed font-sans max-w-sm mt-2 border-t border-gray-50 pt-6">
              "قام بتصميم هذا التطبيق <span className="text-[#1e3a8a] font-black underline decoration-blue-200 decoration-3">حسين محمد هاشمي</span> بمساعدة الذكاء الاصطناعي."
            </p>

            <div className="flex items-center gap-1.5 justify-center text-[10px] text-gray-400 mt-8 font-sans">
              <span>صنع بحب وشغف للتميز والرقابة</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            </div>
          </div>

          {/* Core specs or info block */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-150/50 space-y-3">
            <h4 className="text-xs font-bold text-[#1e3a8a] mb-1">مميزات هذا النظام الفني:</h4>
            
            <div className="space-y-2 text-xs text-gray-600 font-medium">
              <div className="flex items-center gap-2 justify-end flex-row-reverse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a8a]" />
                <span className="text-right">متابعة ومراقبة مستندات الهويات الوطنية والتحذير قبل انتهائها</span>
              </div>
              <div className="flex items-center gap-2 justify-end flex-row-reverse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a8a]" />
                <span className="text-right">سجل تغييرات تفصيلي (Audit Log) يسجل كافة تعديلات الموظفين لزيادة الشفافية والرقابة</span>
              </div>
              <div className="flex items-center gap-2 justify-end flex-row-reverse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a8a]" />
                <span className="text-right">قسم الإجازات اليومية والغيابات لتعزيز المتابعة الميدانية</span>
              </div>
              <div className="flex items-center gap-2 justify-end flex-row-reverse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a8a]" />
                <span className="text-right">تصميم واجهة متطورة، متجاوبة ومريحة بالكامل باللغة العربية</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding Area */}
      <div className="text-center pb-4 text-[10px] font-sans text-gray-400 font-semibold select-none">
        جميع الحقوق محفوظة © ٢٠٢٦ م • شؤون الموظفين
      </div>
    </div>
  );
}
