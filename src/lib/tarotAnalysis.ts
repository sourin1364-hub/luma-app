import { type TarotCard } from "./tarotData";
import { getCardMeaning } from "./tarotMeanings";

interface DrawnCardState {
  card: TarotCard;
  isReversed: boolean;
}

type SpreadType = "single" | "past_present_future" | "love" | "choice";

function getCardName(d: DrawnCardState): string {
  return `«${d.card.nameFa}${d.isReversed ? " (معکوس)" : ""}»`;
}

export function generateTarotSynthesis(drawnCards: DrawnCardState[], spreadType: SpreadType): string {
  if (drawnCards.length === 0) return "";

  let text = "";

  if (spreadType === "single") {
    const card = drawnCards[0];
    text += `لوما کارت ${getCardName(card)} را برای شما بیرون کشیده است.\n\n`;
    text += `پیام این کارت برای وضعیت فعلی شما:\n`;
    text += `${getCardMeaning(card.card.id, card.isReversed)}\n\n`;
    text += `توصیه لوما: این انرژی را درک کنید و با آگاهی از آن، قدم بعدی را بردارید.`;
  } 
  
  else if (spreadType === "past_present_future") {
    const past = drawnCards[0];
    const present = drawnCards[1];
    const future = drawnCards[2];
    
    text += `تحلیل خط زمان شما به این شرح است:\n\n`;
    
    text += `🔙 گذشته: کارت ${getCardName(past)}\n`;
    text += `${getCardMeaning(past.card.id, past.isReversed)}\n\n`;
    
    text += `⏳ حال: کارت ${getCardName(present)}\n`;
    text += `${getCardMeaning(present.card.id, present.isReversed)}\n`;
    if (present.card.isMajor) {
      text += `(حضور این کارت کبیر نشان می‌دهد که شما در یک نقطه عطف مهم تقدیری قرار دارید.)\n`;
    }
    text += `\n`;
    
    text += `🔮 آینده: کارت ${getCardName(future)}\n`;
    text += `${getCardMeaning(future.card.id, future.isReversed)}\n\n`;

    text += `توصیه لوما: با توجه به اینکه از کجا آمده‌اید و اکنون کجا هستید، برای آینده‌ای که این کارت‌ها ترسیم می‌کنند آماده شوید.`;
  } 
  
  else if (spreadType === "love") {
    const you = drawnCards[0];
    const partner = drawnCards[1];
    const relationship = drawnCards[2];

    text += `تحلیل روابط عاطفی شما به این شرح است:\n\n`;

    text += `💜 جایگاه شما: کارت ${getCardName(you)}\n`;
    text += `${getCardMeaning(you.card.id, you.isReversed)}\n\n`;
    
    text += `💙 جایگاه شریک عاطفی: کارت ${getCardName(partner)}\n`;
    text += `${getCardMeaning(partner.card.id, partner.isReversed)}\n\n`;
    
    text += `💖 پویایی و نتیجه رابطه: کارت ${getCardName(relationship)}\n`;
    text += `${getCardMeaning(relationship.card.id, relationship.isReversed)}\n\n`;
    
    text += `توصیه لوما: درک متقابل و همدلی، کلید عبور از این انرژی‌ها و ساختن یک ارتباط عمیق‌تر است.`;
  } 
  
  else if (spreadType === "choice") {
    const current = drawnCards[0];
    const path1 = [drawnCards[1], drawnCards[2]];
    const path2 = [drawnCards[3], drawnCards[4]];

    text += `تحلیل دو مسیر پیش روی شما:\n\n`;

    text += `📍 وضعیت فعلی: کارت ${getCardName(current)}\n`;
    text += `${getCardMeaning(current.card.id, current.isReversed)}\n\n`;
    
    text += `1️⃣ مسیر اول:\n`;
    text += `شروع با کارت ${getCardName(path1[0])} (${getCardMeaning(path1[0].card.id, path1[0].isReversed)})\n`;
    text += `نتیجه با کارت ${getCardName(path1[1])} (${getCardMeaning(path1[1].card.id, path1[1].isReversed)})\n\n`;
    
    text += `2️⃣ مسیر دوم:\n`;
    text += `شروع با کارت ${getCardName(path2[0])} (${getCardMeaning(path2[0].card.id, path2[0].isReversed)})\n`;
    text += `نتیجه با کارت ${getCardName(path2[1])} (${getCardMeaning(path2[1].card.id, path2[1].isReversed)})\n\n`;

    const path1Rev = path1.filter(d => d.isReversed).length;
    const path2Rev = path2.filter(d => d.isReversed).length;

    text += `توصیه لوما: `;
    if (path1Rev < path2Rev) {
      text += `مسیر اول انرژی روان‌تری دارد و چالش‌های کمتری پیش روی شما قرار می‌دهد.`;
    } else if (path2Rev < path1Rev) {
      text += `مسیر دوم هموارتر به نظر می‌رسد و انرژی مثبت‌تری در آن جریان دارد.`;
    } else {
      text += `هر دو مسیر چالش‌های خاص خود را دارند. برای انتخاب بهتر، به ندای قلب خود تکیه کنید.`;
    }
  }

  return text;
}