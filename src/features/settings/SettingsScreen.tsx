import { useRef } from "react";
import { useAppStore } from "../../store/useAppStore";
import { useAuthStore } from "../../store/useAuthStore";
import { db } from "../../db";
import { Button } from "../../components/ui/button";
import { Download, Upload, Trash2, ArrowRight, Settings as SettingsIcon, LogOut, Sun, Moon, Volume2, VolumeX, Info } from "lucide-react";

export function SettingsScreen() {
  const setCurrentRoute = useAppStore((s) => s.setCurrentRoute);
  const themeMode = useAppStore((s) => s.themeMode);
  const setThemeMode = useAppStore((s) => s.setThemeMode);
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const setSoundEnabled = useAppStore((s) => s.setSoundEnabled);
  const { currentUser, logout } = useAuthStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClearData = async () => {
    if (window.confirm("آیا از پاک کردن تمام داده‌ها مطمئن هستید؟ این کار غیرقابل بازگشت است.")) {
      await db.delete();
      window.location.reload();
    }
  };

  const handleExport = async () => {
    if (!currentUser?.id) return;
    try {
      const readings = await db.readings.where("userId").equals(currentUser.id).toArray();
      const progress = await db.progress.get(currentUser.id);
      const dailyDraws = await db.dailyDraws.where("userId").equals(currentUser.id).toArray();
      
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ readings, progress, dailyDraws }, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `luma_backup_${currentUser.username || "user"}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (e) {
      console.error(e);
      alert("خطا در دریافت اطلاعات");
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser?.id) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        if (!data.readings && !data.progress && !data.dailyDraws) {
          throw new Error("فرمت فایل نامعتبر است");
        }

        if (window.confirm("آیا از جایگزینی اطلاعات فعلی با فایل بکاپ مطمئن هستید؟")) {
          await db.readings.where("userId").equals(currentUser.id!).delete();
          await db.dailyDraws.where("userId").equals(currentUser.id!).delete();
          await db.progress.delete(currentUser.id!);

          if (data.readings && Array.isArray(data.readings)) {
            await db.readings.bulkAdd(data.readings.map((r: any) => ({ ...r, userId: currentUser.id })));
          }
          if (data.dailyDraws && Array.isArray(data.dailyDraws)) {
            await db.dailyDraws.bulkAdd(data.dailyDraws.map((d: any) => ({ ...d, userId: currentUser.id })));
          }
          if (data.progress) {
            await db.progress.put({ ...data.progress, userId: currentUser.id });
          }

          alert("بکاپ با موفقیت بازیابی شد! برنامه رفرش می‌شود.");
          window.location.reload();
        }
      } catch (err) {
        console.error(err);
        alert("خطا در خواندن فایل بکاپ");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen w-full px-6 py-8 max-w-2xl mx-auto space-y-6 text-slate-800 dark:text-slate-200" dir="rtl">
      <button onClick={() => setCurrentRoute("home")} className="text-sm text-[rgb(var(--glow-color-rgb))] font-bold mb-4 flex items-center gap-2">
        <ArrowRight className="w-4 h-4" /> بازگشت
      </button>
      
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[rgba(var(--glow-color-rgb),0.1)] rounded-full mb-4 text-[rgb(var(--glow-color-rgb))]">
          <SettingsIcon className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-[rgb(var(--glow-color-rgb))]">تنظیمات</h1>
      </div>

      <div className="glow-card rounded-2xl w-full">
        <div className="glow-card-inner p-6 flex flex-col gap-4">
          <h2 className="text-[rgb(var(--glow-color-rgb))] font-bold mb-2">ظاهر و صدا</h2>
          
          <Button 
            onClick={() => setThemeMode(themeMode === "light" ? "dark" : "light")}
            variant="outline" 
            className="w-full justify-between h-14 rounded-xl settings-btn"
          >
            <span>{themeMode === "light" ? "حالت روز (آبی)" : "حالت شب (تیره)"}</span>
            {themeMode === "light" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          <Button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            variant="outline" 
            className="w-full justify-between h-14 rounded-xl settings-btn"
          >
            <span>{soundEnabled ? "افکت‌های صوتی: روشن" : "افکت‌های صوتی: خاموش"}</span>
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <div className="glow-card rounded-2xl w-full">
        <div className="glow-card-inner p-6 flex flex-col gap-4">
          <h2 className="text-[rgb(var(--glow-color-rgb))] font-bold mb-2">مدیریت داده‌ها</h2>
          
          <Button onClick={handleExport} variant="outline" className="w-full justify-start h-14 rounded-xl settings-btn">
            <Download className="w-5 h-5 ml-3" /> دریافت بکاپ (Export)
          </Button>

          <input type="file" accept=".json" ref={fileInputRef} onChange={handleImport} className="hidden" />
          <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full justify-start h-14 rounded-xl settings-btn">
            <Upload className="w-5 h-5 ml-3" /> بازیابی بکاپ (Import)
          </Button>
          
          <Button onClick={handleClearData} variant="outline" className="w-full justify-start h-14 rounded-xl settings-danger-btn">
            <Trash2 className="w-5 h-5 ml-3" /> پاک کردن تمام داده‌ها
          </Button>
        </div>
      </div>

      <div className="glow-card rounded-2xl w-full">
        <div className="glow-card-inner p-6 flex flex-col gap-4">
          <h2 className="text-[rgb(var(--glow-color-rgb))] font-bold mb-2">درباره برنامه</h2>
          <Button onClick={() => setCurrentRoute("about")} variant="outline" className="w-full justify-start h-14 rounded-xl settings-btn">
            <Info className="w-5 h-5 ml-3" /> درباره ما (Lumera)
          </Button>
        </div>
      </div>

      <Button onClick={logout} className="w-full bg-[rgb(var(--glow-color-rgb))] text-white h-16 rounded-full font-bold text-lg flex items-center gap-3 mt-6 hover:brightness-110 shadow-lg">
        <LogOut className="w-6 h-6" /> خروج از حساب
      </Button>
    </div>
  );
}