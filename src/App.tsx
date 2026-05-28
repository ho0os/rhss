import React, { useState, useEffect } from "react";
import { Employee, EmployeeDocument, ViewState, AuditLogEntry } from "./types";
import { initialEmployees, initialDocuments } from "./data";
// @ts-ignore
import sscoLogo from "./assets/images/ssco_logo_1779881766509.png";

// Sub components import
import DashboardScreen from "./components/DashboardScreen";
import ProfileScreen from "./components/ProfileScreen";
import EditProfileScreen from "./components/EditProfileScreen";
import AddEmployeeScreen from "./components/AddEmployeeScreen";
import DocPreviewScreen from "./components/DocPreviewScreen";
import AppInfoScreen from "./components/AppInfoScreen";
import AllEmployeesScreen from "./components/AllEmployeesScreen";
import AbsencesScreen from "./components/AbsencesScreen";
import VacationsScreen from "./components/VacationsScreen";
import LeaveDuesScreen from "./components/LeaveDuesScreen";
import EmployeeDataScreen from "./components/EmployeeDataScreen";
import LocationsScreen from "./components/LocationsScreen";
import BottomNavBar from "./components/BottomNavBar";
import WhatsAppSheet from "./components/WhatsAppSheet";
import { Check, Info, BellRing } from "lucide-react";

export default function App() {
  // Sync state with localStorage if available, fallback beautifully
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem("hrms_employees");
      const list = saved ? JSON.parse(saved) : initialEmployees;
      return list.map((emp: Employee) => ({ ...emp, avatar: emp.avatar || sscoLogo }));
    } catch {
      return initialEmployees.map((emp) => ({ ...emp, avatar: sscoLogo }));
    }
  });

  const [documents, setDocuments] = useState<EmployeeDocument[]>(() => {
    try {
      const saved = localStorage.getItem("hrms_documents");
      const list = saved ? JSON.parse(saved) : initialDocuments;
      return list.map((doc: EmployeeDocument) => ({ ...doc, previewImage: null }));
    } catch {
      return initialDocuments.map((doc) => ({ ...doc, previewImage: null }));
    }
  });

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("EMP-2024-089");
  const [selectedDocId, setSelectedDocId] = useState<string>("DOC-001");
  const [activeScreen, setActiveScreen] = useState<ViewState>("dashboard");
  const [isVacationsExpanded, setIsVacationsExpanded] = useState<boolean>(false);
  const [isAbsencesExpanded, setIsAbsencesExpanded] = useState<boolean>(false);

  // WhatsApp template overlay states
  const [whatsAppModalEmployee, setWhatsAppModalEmployee] = useState<Employee | null>(null);

  // Floating notifications/toasts states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "info">("success");

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("hrms_employees", JSON.stringify(employees));
    } catch (err) {
      console.error("Local storage saving error:", err);
    }
  }, [employees]);

  useEffect(() => {
    try {
      localStorage.setItem("hrms_documents", JSON.stringify(documents));
    } catch (err) {
      console.error("Local storage saving error:", err);
    }
  }, [documents]);

  const triggerToast = (msg: string, type: "success" | "info" = "success") => {
    setToastType(type);
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Actions
  const handleAddEmployee = (newEmp: Employee) => {
    const empWithAvatar = { ...newEmp, avatar: newEmp.avatar || sscoLogo };
    setEmployees((prev) => [empWithAvatar, ...prev]);
    setSelectedEmployeeId(newEmp.id);
    setActiveScreen("profile");
    triggerToast(`تمت إضافة الموظف "${newEmp.name}" بنجاح وتخصيص مستنداته!`);
  };

  const handleUpdateEmployee = (updatedEmp: Employee, originalId: string) => {
    setEmployees((prev) => {
      return prev.map((emp) => {
        if (emp.id === originalId) {
          // Compare fields to detect modifications and generate audit logs
          const newLogs: AuditLogEntry[] = emp.auditLog ? [...emp.auditLog] : [];
          
          const checkChange = (field: string, fieldNameAr: string, oldVal: string, newVal: string) => {
            if (oldVal !== newVal) {
              newLogs.push({
                id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                field,
                fieldNameAr,
                oldValue: oldVal || "—",
                newValue: newVal || "—",
                timestamp: new Date().toISOString(),
                updatedBy: "hosan66@gmail.com" // Current User Email
              });
            }
          };

          const statusMap: Record<string, string> = {
            active: "نشط ومناوب",
            on_leave: "في إجازة",
            resigned: "استقالة",
            terminated: "إنهاء خدمات",
            transferred: "حول",
            transferred_from: "محول",
            absent: "غياب بدون عذر"
          };

          const getStatusText = (st: string) => statusMap[st] || st;

          checkChange("id", "الرقم الوظيفي", emp.id, updatedEmp.id);
          checkChange("name", "اسم الموظف", emp.name, updatedEmp.name);
          checkChange("role", "المسمى الوظيفي", emp.role, updatedEmp.role);
          checkChange("department", "الفرع / القسم", emp.department, updatedEmp.department);
          checkChange("status", "الحالة الوظيفية", getStatusText(emp.status), getStatusText(updatedEmp.status));
          checkChange("phone", "رقم الجوال", emp.phone, updatedEmp.phone);
          checkChange("nationalId", "رقم الهوية الوطنية", emp.nationalId, updatedEmp.nationalId);

          return {
            ...updatedEmp,
            avatar: updatedEmp.avatar || sscoLogo,
            auditLog: newLogs
          };
        }
        return emp;
      });
    });
    setSelectedEmployeeId(updatedEmp.id);
    setActiveScreen("profile");
    triggerToast(`تم تحديث بيانات الموظف "${updatedEmp.name}" بنجاح!`);
  };

  const handleImportExcel = (importedList: Employee[]) => {
    const listWithAvatar = importedList.map((emp) => ({ ...emp, avatar: emp.avatar || sscoLogo }));
    setEmployees((prev) => [...listWithAvatar, ...prev]);
    triggerToast(`تم استيراد عدد (${importedList.length}) موظف بنجاح عبر إكسل!`);
  };

  const handleDeleteEmployee = (idToDelete: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== idToDelete));
    triggerToast("تم حذف ملف الموظف بنجاح وإزالته من سجلات شؤون الموظفين!");
    setActiveScreen("dashboard");
  };

  const handleDeleteMultipleEmployees = (idsToDelete: string[]) => {
    setEmployees((prev) => prev.filter((emp) => !idsToDelete.includes(emp.id)));
    triggerToast(`تم حذف عدد ${idsToDelete.length} من الموظفين بنجاح وإزالتهم نهائياً من سجلات شؤون الموظفين!`);
  };

  const handleWhatsAppSendSuccess = (parsedMsg: string) => {
    triggerToast("تم فتح واتساب مباشرة وتجهيز تذكير المستند المحدد الموجه بنجاح!", "success");
  };

  // Select active active employee
  const currentEmployee = employees.find((e) => e.id === selectedEmployeeId) || employees[0];
  const currentDocument = documents.find((d) => d.id === selectedDocId) || documents[0];

  return (
    <div className="min-h-screen bg-[#f8f9fa] custom-scrollbar selection:bg-blue-100 flex flex-col relative overflow-x-hidden select-none font-sans" style={{ direction: "rtl" }}>
      
      {/* Toast Notification HUD */}
      {toastMessage && (
        <div className="fixed top-6 left-4 right-4 z-50 animate-bounce-short pointer-events-auto">
          <div className="bg-[#1e3a8a] text-white p-4 rounded-xl shadow-2xl flex items-center justify-between border border-blue-800 gap-3 max-w-sm mx-auto">
            <button 
              onClick={() => setToastMessage(null)}
              className="text-blue-200 hover:text-white transition-colors"
            >
              ×
            </button>
            <div className="flex items-center gap-3 justify-end text-right flex-grow">
              <span className="text-xs font-semibold leading-relaxed">{toastMessage}</span>
              {toastType === "success" ? (
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 text-white shadow-md">
                  <Check className="w-4 h-4 font-bold" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white shadow-md">
                  <Info className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Screen Routing HUD */}
      <div className="flex-1 w-full max-w-md mx-auto relative bg-white min-h-screen shadow-md border-x border-gray-100">
        
        {activeScreen === "dashboard" && (
          <DashboardScreen
            employees={employees}
            onSelectEmployee={setSelectedEmployeeId}
            onScreenChange={setActiveScreen}
            onTriggerWhatsApp={setWhatsAppModalEmployee}
            onImportExcel={handleImportExcel}
            isVacationsExpanded={isVacationsExpanded}
            setIsVacationsExpanded={setIsVacationsExpanded}
            isAbsencesExpanded={isAbsencesExpanded}
            setIsAbsencesExpanded={setIsAbsencesExpanded}
          />
        )}

        {activeScreen === "profile" && currentEmployee && (
          <ProfileScreen
            employee={currentEmployee}
            onScreenChange={setActiveScreen}
            onSelectDoc={setSelectedDocId}
            onTriggerWhatsApp={setWhatsAppModalEmployee}
            onDeleteEmployee={handleDeleteEmployee}
          />
        )}

        {activeScreen === "edit" && currentEmployee && (
          <EditProfileScreen
            employee={currentEmployee}
            onSave={handleUpdateEmployee}
            onCancel={() => setActiveScreen("profile")}
            onTriggerWhatsApp={setWhatsAppModalEmployee}
          />
        )}

        {activeScreen === "add" && (
          <AddEmployeeScreen
            onAdd={handleAddEmployee}
            onCancel={() => setActiveScreen("dashboard")}
          />
        )}

        {activeScreen === "preview-doc" && currentDocument && (
          <DocPreviewScreen
            document={currentDocument}
            employee={currentEmployee}
            onBack={() => {
              // Safe return fallback route
              if (selectedEmployeeId) {
                setActiveScreen("profile");
              } else {
                setActiveScreen("dashboard");
              }
            }}
          />
        )}

        {activeScreen === "app-info" && (
          <AppInfoScreen
            onBack={() => setActiveScreen("dashboard")}
          />
        )}

        {activeScreen === "all-employees" && (
          <AllEmployeesScreen
            employees={employees}
            onSelectEmployee={setSelectedEmployeeId}
            onScreenChange={setActiveScreen}
            onTriggerWhatsApp={setWhatsAppModalEmployee}
            onBack={() => setActiveScreen("dashboard")}
          />
        )}

        {activeScreen === "absences" && (
          <AbsencesScreen
            employees={employees}
            onUpdateEmployee={handleUpdateEmployee}
            onSelectEmployee={setSelectedEmployeeId}
            onScreenChange={setActiveScreen}
            onTriggerWhatsApp={setWhatsAppModalEmployee}
          />
        )}

        {activeScreen === "vacations" && (
          <VacationsScreen
            employees={employees}
            onUpdateEmployee={handleUpdateEmployee}
            onScreenChange={setActiveScreen}
            onTriggerWhatsApp={(emp) => setWhatsAppModalEmployee(emp)}
          />
        )}

        {activeScreen === "leave-dues" && (
          <LeaveDuesScreen
            employees={employees}
            onUpdateEmployee={handleUpdateEmployee}
            onScreenChange={setActiveScreen}
          />
        )}

        {activeScreen === "employee-data" && (
          <EmployeeDataScreen
            employees={employees}
            onScreenChange={setActiveScreen}
            onSelectEmployee={setSelectedEmployeeId}
            onDeleteMultipleEmployees={handleDeleteMultipleEmployees}
          />
        )}

        {activeScreen === "locations" && (
          <LocationsScreen
            employees={employees}
            onScreenChange={setActiveScreen}
            onSelectEmployee={setSelectedEmployeeId}
          />
        )}

        {/* Global Tab Bar Persistent at the footer on all pages so that Home is always accessible */}
        {true && (
          <BottomNavBar
            activeScreen={activeScreen}
            onScreenChange={setActiveScreen}
            selectedEmployeeId={selectedEmployeeId}
          />
        )}
      </div>

      {/* WhatsApp sheet trigger element */}
      {whatsAppModalEmployee && (
        <WhatsAppSheet
          employee={whatsAppModalEmployee}
          onClose={() => setWhatsAppModalEmployee(null)}
          onSendSuccess={handleWhatsAppSendSuccess}
        />
      )}
    </div>
  );
}
