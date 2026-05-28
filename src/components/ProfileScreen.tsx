import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Printer, Edit2, ShieldCheck, Mail, Calendar, Phone, FileText, Share2, Eye, Award, History, Clock, Trash2, AlertTriangle } from "lucide-react";
import { Employee, EmployeeDocument, ViewState } from "../types";
import { initialDocuments } from "../data";

interface ProfileScreenProps {
  employee: Employee;
  onScreenChange: (screen: ViewState) => void;
  onSelectDoc: (docId: string) => void;
  onTriggerWhatsApp: (employee: Employee) => void;
  onDeleteEmployee: (id: string) => void;
}

export default function ProfileScreen({
  employee,
  onScreenChange,
  onSelectDoc,
  onTriggerWhatsApp,
  onDeleteEmployee
}: ProfileScreenProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  
  // Calculate dynamic tenure from Join Date to Current Date (May 2026)
  const calculateTenure = (joinDateStr: string) => {
    try {
      const joinDate = new Date(joinDateStr);
      // Fixed current date as per ADDITIONAL_METADATA 2026-05-26
      const currentDate = new Date("2026-05-26");
      
      let years = currentDate.getFullYear() - joinDate.getFullYear();
      let months = currentDate.getMonth() - joinDate.getMonth();
      let days = currentDate.getDate() - joinDate.getDate();

      if (days < 0) {
        months -= 1;
        // Approximation of days in previous month
        days += 30;
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      return {
        years: years >= 10 ? `${years}` : `0${Math.max(0, years)}`,
        months: months >= 10 ? `${months}` : `0${Math.max(0, months)}`,
        days: days >= 10 ? `${days}` : `0${Math.max(0, days)}`
      };
    } catch {
      return { years: "04", months: "07", days: "12" };
    }
  };

  const tenure = calculateTenure(employee.joinDate);

  const hasCompletedOneYear = (joinDateStr: string | undefined): boolean => {
    if (!joinDateStr) return false;
    try {
      const joinDate = new Date(joinDateStr);
      const currentDate = new Date("2026-05-26");
      let yearsDiff = currentDate.getFullYear() - joinDate.getFullYear();
      const monthDiff = currentDate.getMonth() - joinDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < joinDate.getDate())) {
        yearsDiff--;
      }
      return yearsDiff >= 1;
    } catch {
      return false;
    }
  };

  // Helper to format join date nicely in Arabic
  const formatJoinDateArabic = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      
      const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
      return date.toLocaleDateString("ar-EG", options);
    } catch {
      return dateStr;
    }
  };

  const formatExpiryDateArabic = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      
      const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
      return date.toLocaleDateString("ar-EG", options);
    } catch {
      return dateStr;
    }
  };

  const getDocumentExpiryDate = (doc: EmployeeDocument, emp: Employee) => {
    if (doc.badgeType === "id_card") {
      return emp.nationalIdExpiry;
    }
    // For security file or generic doc, let's say it expires 5 years after join date
    try {
      const join = new Date(emp.joinDate);
      const expiry = new Date(join.getFullYear() + 5, join.getMonth(), join.getDate());
      return expiry.toISOString().split("T")[0];
    } catch {
      return "2027-12-31";
    }
  };

  const getDocumentStatus = (expiryDateStr: string) => {
    try {
      const expiryDate = new Date(expiryDateStr);
      const currentDate = new Date("2026-05-26");
      if (isNaN(expiryDate.getTime())) {
        return { status: "valid", text: "صالح ومفعل", colorClass: "bg-green-50 text-green-600 border-green-150" };
      }
      
      const diffTime = expiryDate.getTime() - currentDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) {
        return { status: "expired", text: "منتهي الصلاحية", colorClass: "bg-rose-50 text-rose-600 border-rose-200" };
      } else if (diffDays <= 90) {
        return { status: "expiring-soon", text: "ينتهي قريباً", colorClass: "bg-amber-50 text-amber-600 border-amber-200 animate-pulse" };
      } else {
        return { status: "valid", text: "صالح ومفعل", colorClass: "bg-green-50 text-green-600 border-green-200" };
      }
    } catch {
      return { status: "valid", text: "صالح ومفعل", colorClass: "bg-green-50 text-green-600 border-green-200" };
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const initials = employee.name.split(" ").slice(0, 2).map((n) => n[0]).join(" ");

  return (
    <div className="pb-24 pt-4 px-4 bg-[#f8f9fa] min-h-screen">
      {/* Top Header Bar */}
      <header className="flex flex-row justify-between items-center h-16 w-full mb-4">
        <div className="flex items-center gap-2">
          {/* Suppress action button / keeping standard layout */}
        </div>
        <h1 className="font-sans text-base font-bold text-[#1e3a8a]">ملف الموظف</h1>
        <button 
          onClick={() => onScreenChange("dashboard")}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 transition-transform active:scale-95 shadow-sm"
        >
          {/* pointing right to return back in RTL */}
          <ArrowRight className="w-5 h-5 text-[#1e3a8a]" />
        </button>
      </header>

      <main className="space-y-4 max-w-lg mx-auto">
        {/* Asymmetrical Profile Header Card */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden p-6 relative text-right">
          {/* Edit pen circle */}
          <button 
            onClick={() => onScreenChange("edit")}
            className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center bg-blue-50 text-[#1e3a8a] hover:bg-blue-100 rounded-full shadow-sm hover:brightness-95 active:scale-90 transition-all border border-blue-100"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-center sm:flex-row-reverse sm:items-center gap-6">
            {/* Avatar display frame */}
            <div className="relative flex-shrink-0">
              {employee.avatar ? (
                <img 
                  className="w-20 h-20 rounded-full object-cover shadow-sm border border-gray-100 shrink-0" 
                  src={employee.avatar}
                  alt={employee.name}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-50 text-[#1e3a8a] text-lg font-black flex items-center justify-center shadow-xs border border-gray-100 select-none shrink-0 font-sans">
                  {initials}
                </div>
              )}
              <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${employee.status === "active" ? "bg-green-500" : "bg-amber-500"}`} />
            </div>

            {/* Profile Meta info */}
            <div className="text-center sm:text-right flex-1 select-text w-full">
              <div className="flex items-center gap-1.5 justify-center sm:justify-end mb-2">
                <span className={`w-2.5 h-2.5 rounded-full ${employee.status === "active" ? "bg-green-500" : "bg-amber-500"}`} />
                <span className="text-xs text-gray-500 font-bold">
                  {employee.status === "active" ? "نشط ومناوب" : "في إجازة رسمية"}
                </span>
              </div>
              
              <h2 className="text-lg font-bold text-[#00236f] mb-1">{employee.name}</h2>
              <p className="text-xs text-gray-500 mb-3 font-medium">{employee.role}</p>
              
              {employee.certified && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-[#1e3a8a] text-[10px] font-bold border border-blue-100">
                  <Award className="w-3.5 h-3.5 ml-1 text-[#1e3a8a]" />
                  موظف معتمد
                </div>
              )}

              {employee.status === "on_leave" && (
                <div className="mt-2 flex flex-col items-center sm:items-end gap-1">
                  {(employee.leaveStartDate || employee.leaveEndDate) && (
                    <span className="text-[10px] text-amber-600 font-bold bg-amber-50/50 px-2.5 py-1 rounded-lg border border-amber-100">
                      الفترة: من {employee.leaveStartDate || "—"} إلى {employee.leaveEndDate || "—"}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Key Identifiers Grid */}
          <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100">
            <div>
              <span className="text-[10px] text-gray-400 block mb-1">الرقم الوظيفي</span>
              <span className="text-sm font-extrabold text-[#1a56db]">#{employee.id}</span>
              {hasCompletedOneYear(employee.joinDate) && (
                <button 
                  onClick={() => onScreenChange("leave-dues")}
                  className="text-[9px] text-rose-700 font-extrabold mt-1 cursor-pointer hover:bg-rose-100 transition-colors inline-block bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200"
                >
                  مستحق مستحقات الاجازة 💰
                </button>
              )}
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block mb-1">رقم الهوية الوطنية</span>
              <span className="text-sm font-extrabold text-gray-700 tracking-wider">{employee.nationalId}</span>
            </div>
            <div className="col-span-2 pt-1">
              <span className="text-[10px] text-gray-400 block mb-1">تاريخ انتهاء الهوية</span>
              <span className="text-sm font-extrabold text-amber-700">
                {formatExpiryDateArabic(employee.nationalIdExpiry)}
              </span>
            </div>
            <div className="col-span-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onSelectDoc("DOC-001");
                  onScreenChange("preview-doc");
                }}
                className="w-full h-11 flex items-center justify-center gap-2 bg-[#1e3a8a] text-white hover:bg-[#152a63] rounded-xl text-xs font-bold active:scale-95 transition-all shadow-sm border border-blue-800"
              >
                <Printer className="w-4 h-4 text-white" />
                <span>طباعة الهوية الوطنية</span>
              </button>
            </div>
          </div>
        </section>

        {/* Service Duration Bento Card */}
        <section className="bg-[#1e3a8a] text-white rounded-2xl p-6 shadow-md overflow-hidden relative text-right">
          <div className="absolute -left-6 -top-6 opacity-10 pointer-events-none">
            <Calendar className="w-24 h-24" />
          </div>

          <div className="relative z-10">
            <h3 className="text-xs font-bold text-blue-200 mb-4 flex items-center gap-2 justify-end">
              <span>مدة الخدمة المتراكمة</span>
              {/* history icon */}
              <Calendar className="w-4 h-4 text-blue-200" />
            </h3>

            {/* Counter blocks */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl py-3 px-2">
                <div className="text-center font-extrabold text-[#9cd4ff] text-xl">{tenure.years}</div>
                <div className="text-[10px] text-blue-100/90 font-medium">سنوات</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl py-3 px-2">
                <div className="text-center font-extrabold text-[#9cd4ff] text-xl">{tenure.months}</div>
                <div className="text-[10px] text-blue-100/90 font-medium font-arabic">أشهر</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl py-3 px-2">
                <div className="text-center font-extrabold text-[#9cd4ff] text-xl">{tenure.days}</div>
                <div className="text-[10px] text-blue-100/90 font-medium font-arabic">أيام</div>
              </div>
            </div>

            <p className="text-[10px] text-blue-200 mt-4 text-center font-medium font-arabic">
              تاريخ الانضمام: {formatJoinDateArabic(employee.joinDate)}
            </p>
          </div>
        </section>

        {/* Contact info and Print Button */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
            <button 
              onClick={() => onTriggerWhatsApp(employee)}
              className="w-12 h-12 flex items-center justify-center bg-[#25D366] text-white rounded-full shadow-lg active:scale-90 transition-transform hover:bg-[#20ba59]"
            >
              <Phone className="w-5 h-5 fill-current rotate-90" />
            </button>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 block font-arabic">رقم الجوال</span>
              <span className="text-sm font-bold text-gray-800 tracking-wide inline-block" style={{ direction: "ltr" }}>
                {employee.phone}
              </span>
            </div>
          </div>

          <button 
            onClick={handlePrint}
            className="bg-[#1e3a8a] text-white rounded-2xl p-4 shadow-sm flex items-center justify-center gap-2 active:scale-95 hover:bg-[#152a63] transition-colors"
          >
            <Printer className="w-5 h-5" />
            <span className="text-sm font-bold">طباعة الملف الوظيفي</span>
          </button>
        </section>

        {/* سجل التغييرات والرقابة Timeline */}
        <section className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-right space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50 flex-row-reverse">
            <div className="flex items-center gap-2 flex-row-reverse">
              <History className="w-5 h-5 text-[#1e3a8a]" />
              <h3 className="text-sm font-bold text-[#1e3a8a] select-none">سجل التغييرات والرقابة</h3>
            </div>
            <span className="text-[10px] bg-blue-50 text-[#1e3a8a] px-2.5 py-1 rounded-full font-bold border border-blue-100/50">
              {employee.auditLog?.length || 0} تعديل
            </span>
          </div>

          {employee.auditLog && employee.auditLog.length > 0 ? (
            <div className="relative pr-4 border-r-2 border-dashed border-gray-150 space-y-4">
              {employee.auditLog.slice().reverse().map((log) => {
                const formatAuditTimestamp = (isoStr: string) => {
                  try {
                    const date = new Date(isoStr);
                    if (isNaN(date.getTime())) return isoStr;
                    
                    const options: Intl.DateTimeFormatOptions = { 
                      day: "numeric", 
                      month: "long", 
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    };
                    return date.toLocaleDateString("ar-EG", options);
                  } catch {
                    return isoStr;
                  }
                };
                
                return (
                  <div key={log.id} className="relative group text-right">
                    {/* Bullet point accent */}
                    <span className="absolute -right-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between flex-row-reverse gap-4">
                        <span className="text-[10px] font-extrabold text-[#1e3a8a] bg-blue-50 px-2.5 py-0.5 rounded-md">
                          {log.fieldNameAr}
                        </span>
                        <span className="text-[9px] text-gray-400 font-sans flex items-center gap-1 flex-row-reverse">
                          <Clock className="w-3 h-3 text-gray-300" />
                          <span>{formatAuditTimestamp(log.timestamp)}</span>
                        </span>
                      </div>

                      <div className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-120/50 mt-2">
                        <div className="flex items-center gap-1.5 justify-end flex-wrap">
                          <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-sm">{log.newValue}</span>
                          <span className="text-[9px] text-gray-400 font-bold font-arabic">بدلاً من</span>
                          <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-sm line-through">{log.oldValue}</span>
                        </div>
                        
                        {log.updatedBy && (
                          <div className="text-[8px] text-gray-400 border-t border-gray-100/50 pt-1.5 font-sans flex items-center gap-1 justify-end">
                            <span>بواسطة: {log.updatedBy}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-6 text-center text-gray-400 flex flex-col items-center justify-center gap-2 bg-gray-50 rounded-2xl border border-dashed border-gray-150">
              <ShieldCheck className="w-8 h-8 text-green-500/80" />
              <p className="text-xs font-bold text-gray-500 select-none">ملف الموظف سليم ولم تطرأ عليه أي تعديلات بعد</p>
              <p className="text-[9px] text-gray-400 max-w-xs font-medium">كل تعديل تقوم به على المسمى الوظيفي، الفرع أو الحالة سيتم تسجيله وطباعته هنا تلقائياً لزيادة الأمان والرقابة.</p>
            </div>
          )}
        </section>

        {/* Uploaded Documents List Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-[11px] font-bold text-gray-400">2 مستندات معتمدة</span>
            <h3 className="text-sm font-bold text-[#1e3a8a] select-none">المستندات والوثائق</h3>
          </div>

          {/* Document Cards */}
          {initialDocuments.map((doc) => {
            const expiryDateStr = getDocumentExpiryDate(doc, employee);
            const badgeStatus = getDocumentStatus(expiryDateStr);

            return (
              <div 
                key={doc.id}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col gap-4 text-right"
              >
                <div className="flex flex-row-reverse items-start justify-between gap-4">
                  <div className="flex flex-row-reverse items-start gap-3">
                    <div className="w-12 h-12 flex items-center justify-center bg-blue-50 text-[#1e3a8a] rounded-xl flex-shrink-0 border border-blue-100">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1 select-text">
                      <h4 className="text-xs font-bold text-gray-800">{doc.title}</h4>
                      <p className="text-[10px] text-gray-400 font-medium mt-1">
                        {doc.fileName} • ينتهي في: {formatExpiryDateArabic(expiryDateStr)}
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Status Badge */}
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${badgeStatus.colorClass}`}>
                      {badgeStatus.text}
                    </span>
                  </div>
                </div>

                {/* Doc actions bottom bar */}
                <div className="flex gap-2 border-t border-gray-100 pt-3 flex-row-reverse">
                  <button 
                    onClick={() => {
                      // Dynamically inject employee's specific name, ID and expiry for high-fidelity ID card preview if it's card type
                      const dynamicDoc = {
                        ...doc,
                        previewName: doc.badgeType === "id_card" ? employee.name : doc.previewName,
                        previewId: doc.badgeType === "id_card" ? employee.nationalId : doc.previewId,
                        previewExpiry: doc.badgeType === "id_card" ? formatExpiryDateArabic(employee.nationalIdExpiry) : doc.previewExpiry
                      };
                      onSelectDoc(dynamicDoc.id);
                      // Since we mutated the local state inside onSelectDoc conceptually (or rather let the parent handle the doc update), we select it
                      onSelectDoc(doc.id);
                      onScreenChange("preview-doc");
                    }}
                    className="flex-1 h-10 flex items-center justify-center gap-2 bg-blue-50 text-[#1e3a8a] hover:bg-blue-100 rounded-full text-xs font-bold active:scale-95 transition-all border border-blue-100"
                  >
                    <Eye className="w-4 h-4 text-[#1e3a8a]" />
                    <span>عرض / طباعة المستند</span>
                  </button>

                  <button 
                    onClick={() => {
                      alert("تم نسخ رابط المستند ومشاركته بنجاح!");
                    }}
                    className="w-10 h-10 flex items-center justify-center border border-green-500 hover:bg-green-50 text-green-600 rounded-full active:scale-95 transition-all flex-shrink-0"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        {/* منقطة العمليات الحرجة: حذف الموظف نهائياً */}
        <section className="bg-rose-50/50 rounded-2xl p-5 border border-rose-100 shadow-sm text-right space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-rose-100 flex-row-reverse">
            <div className="flex items-center gap-2 flex-row-reverse text-rose-700">
              <Trash2 className="w-4 h-4" />
              <h3 className="text-xs font-black select-none font-sans">منطقة الأمان والعمليات الحرجة</h3>
            </div>
            <span className="text-[8px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md font-extrabold">
              حذف نهائي
            </span>
          </div>

          {!showDeleteConfirm ? (
            <div className="space-y-3">
              <p className="text-[10px] text-rose-600/90 font-bold leading-relaxed">
                في حال استقالة الموظف أو إنهاء خدماته بالكامل، يمكنك إزالته من نظام شؤون الموظفين بشكل نهائي. هذا الإجراء سينعكس فوراً.
              </p>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full h-11 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold active:scale-95 transition-all shadow-sm border border-rose-700"
              >
                <Trash2 className="w-4 h-4 text-white" />
                <span>طلب حذف الموظف من السجلات</span>
              </button>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-xl border border-rose-200 space-y-4 animate-scaleUp">
              <div className="flex items-start gap-2 flex-row-reverse text-right">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-rose-700">تأكيد عملية الحذف النهائية!</h4>
                  <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                    هل أنت متأكد من رغبتك في حذف الموظف <span className="font-black text-gray-800">{employee.name}</span> نهائياً؟ كافة المستندات والتراخيص وبطاقة الهوية التابعة له ستتم إزالتها من النظام فوراً ولا يمكن استرجاعها.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 flex-row-reverse">
                <button
                  type="button"
                  onClick={() => onDeleteEmployee(employee.id)}
                  className="flex-1 h-9 flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold transition-colors active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>نعم، حذف نهائي</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 h-9 flex items-center justify-center bg-gray-150 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-bold transition-colors active:scale-95"
                >
                  <span>إلغاء</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
