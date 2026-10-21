export type TarotSuit = "major" | "cups" | "pentacles" | "swords" | "wands";
export type TarotRank = "ace" | "two" | "three" | "four" | "five" | "six" | "seven" | "eight" | "nine" | "ten" | "page" | "knight" | "queen" | "king" | "major";

export interface TarotCard {
  id: number;
  fileName: string;
  name: string;
  nameFa: string;
  suit: TarotSuit;
  rank: TarotRank;
  isMajor: boolean;
}

export const tarotCards: TarotCard[] = [
  // ================= MAJOR ARCANA (0-21) =================
  { id: 0, fileName: "major-00.webp", name: "The Fool", nameFa: "\u0627\u062D\u0645\u0642", suit: "major", rank: "major", isMajor: true },
  { id: 1, fileName: "major-01.webp", name: "The Magician", nameFa: "\u062C\u0627\u062F\u0648\u06AF\u0631", suit: "major", rank: "major", isMajor: true },
  { id: 2, fileName: "major-02.webp", name: "The High Priestess", nameFa: "\u06A9\u0627\u0647\u0646 \u0627\u0639\u0638\u0645", suit: "major", rank: "major", isMajor: true },
  { id: 3, fileName: "major-03.webp", name: "The Empress", nameFa: "\u0645\u0644\u06A9\u0647", suit: "major", rank: "major", isMajor: true },
  { id: 4, fileName: "major-04.webp", name: "The Emperor", nameFa: "\u0627\u0645\u067E\u0631\u0627\u062A\u0648\u0631", suit: "major", rank: "major", isMajor: true },
  { id: 5, fileName: "major-05.webp", name: "The Hierophant", nameFa: "\u067E\u0627\u067E", suit: "major", rank: "major", isMajor: true },
  { id: 6, fileName: "major-06.webp", name: "The Lovers", nameFa: "\u0639\u0627\u0634\u0642\u0627\u0646", suit: "major", rank: "major", isMajor: true },
  { id: 7, fileName: "major-07.webp", name: "The Chariot", nameFa: "\u0627\u0631\u0627\u0628\u0647", suit: "major", rank: "major", isMajor: true },
  { id: 8, fileName: "major-08.webp", name: "Strength", nameFa: "\u0642\u062F\u0631\u062A", suit: "major", rank: "major", isMajor: true },
  { id: 9, fileName: "major-09.webp", name: "The Hermit", nameFa: "\u0631\u0627\u0647\u0628", suit: "major", rank: "major", isMajor: true },
  { id: 10, fileName: "major-10.webp", name: "Wheel of Fortune", nameFa: "\u0686\u0631\u062E \u0628\u062E\u062A", suit: "major", rank: "major", isMajor: true },
  { id: 11, fileName: "major-11.webp", name: "Justice", nameFa: "\u0639\u062F\u0627\u0644\u062A", suit: "major", rank: "major", isMajor: true },
  { id: 12, fileName: "major-12.webp", name: "The Hanged Man", nameFa: "\u0645\u0631\u062F \u0622\u0648\u06CC\u0632\u0627\u0646", suit: "major", rank: "major", isMajor: true },
  { id: 13, fileName: "major-13.webp", name: "Death", nameFa: "\u0645\u0631\u06AF", suit: "major", rank: "major", isMajor: true },
  { id: 14, fileName: "major-14.webp", name: "Temperance", nameFa: "\u0645\u06CC\u0627\u0646\u0647\u200C\u0631\u0648\u06CC", suit: "major", rank: "major", isMajor: true },
  { id: 15, fileName: "major-15.webp", name: "The Devil", nameFa: "\u0634\u06CC\u0637\u0627\u0646", suit: "major", rank: "major", isMajor: true },
  { id: 16, fileName: "major-16.webp", name: "The Tower", nameFa: "\u0628\u0631\u062C", suit: "major", rank: "major", isMajor: true },
  { id: 17, fileName: "major-17.webp", name: "The Star", nameFa: "\u0633\u062A\u0627\u0631\u0647", suit: "major", rank: "major", isMajor: true },
  { id: 18, fileName: "major-18.webp", name: "The Moon", nameFa: "\u0645\u0627\u0647", suit: "major", rank: "major", isMajor: true },
  { id: 19, fileName: "major-19.webp", name: "The Sun", nameFa: "\u062E\u0648\u0631\u0634\u06CC\u062F", suit: "major", rank: "major", isMajor: true },
  { id: 20, fileName: "major-20.webp", name: "Judgement", nameFa: "\u062F\u0627\u0648\u0631\u06CC", suit: "major", rank: "major", isMajor: true },
  { id: 21, fileName: "major-21.webp", name: "The World", nameFa: "\u062C\u0647\u0627\u0646", suit: "major", rank: "major", isMajor: true },

  // ================= CUPS (22-35) =================
  { id: 22, fileName: "cups-ace.webp", name: "Ace of Cups", nameFa: "\u0622\u0633 \u062C\u0627\u0645", suit: "cups", rank: "ace", isMajor: false },
  { id: 23, fileName: "cups-two.webp", name: "Two of Cups", nameFa: "\u062F\u0648 \u062C\u0627\u0645", suit: "cups", rank: "two", isMajor: false },
  { id: 24, fileName: "cups-three.webp", name: "Three of Cups", nameFa: "\u0633\u0647 \u062C\u0627\u0645", suit: "cups", rank: "three", isMajor: false },
  { id: 25, fileName: "cups-four.webp", name: "Four of Cups", nameFa: "\u0686\u0647\u0627\u0631 \u062C\u0627\u0645", suit: "cups", rank: "four", isMajor: false },
  { id: 26, fileName: "cups-five.webp", name: "Five of Cups", nameFa: "\u067E\u0646\u062C \u062C\u0627\u0645", suit: "cups", rank: "five", isMajor: false },
  { id: 27, fileName: "cups-six.webp", name: "Six of Cups", nameFa: "\u0634\u0634 \u062C\u0627\u0645", suit: "cups", rank: "six", isMajor: false },
  { id: 28, fileName: "cups-seven.webp", name: "Seven of Cups", nameFa: "\u0647\u0641\u062A \u062C\u0627\u0645", suit: "cups", rank: "seven", isMajor: false },
  { id: 29, fileName: "cups-eight.webp", name: "Eight of Cups", nameFa: "\u0647\u0634\u062A \u062C\u0627\u0645", suit: "cups", rank: "eight", isMajor: false },
  { id: 30, fileName: "cups-nine.webp", name: "Nine of Cups", nameFa: "\u0646\u0647 \u062C\u0627\u0645", suit: "cups", rank: "nine", isMajor: false },
  { id: 31, fileName: "cups-ten.webp", name: "Ten of Cups", nameFa: "\u062F\u0647 \u062C\u0627\u0645", suit: "cups", rank: "ten", isMajor: false },
  { id: 32, fileName: "cups-page.webp", name: "Page of Cups", nameFa: "\u0633\u0631\u0628\u0627\u0632 \u062C\u0627\u0645", suit: "cups", rank: "page", isMajor: false },
  { id: 33, fileName: "cups-knight.webp", name: "Knight of Cups", nameFa: "\u0634\u0648\u0627\u0644\u06CC\u0647 \u062C\u0627\u0645", suit: "cups", rank: "knight", isMajor: false },
  { id: 34, fileName: "cups-queen.webp", name: "Queen of Cups", nameFa: "\u0645\u0644\u06A9\u0647 \u062C\u0627\u0645", suit: "cups", rank: "queen", isMajor: false },
  { id: 35, fileName: "cups-king.webp", name: "King of Cups", nameFa: "\u0634\u0627\u0647 \u062C\u0627\u0645", suit: "cups", rank: "king", isMajor: false },

  // ================= PENTACLES (36-49) =================
  { id: 36, fileName: "pentacles-ace.webp", name: "Ace of Pentacles", nameFa: "\u0622\u0633 \u0633\u06A9\u0647", suit: "pentacles", rank: "ace", isMajor: false },
  { id: 37, fileName: "pentacles-two.webp", name: "Two of Pentacles", nameFa: "\u062F\u0648 \u0633\u06A9\u0647", suit: "pentacles", rank: "two", isMajor: false },
  { id: 38, fileName: "pentacles-three.webp", name: "Three of Pentacles", nameFa: "\u0633\u0647 \u0633\u06A9\u0647", suit: "pentacles", rank: "three", isMajor: false },
  { id: 39, fileName: "pentacles-four.webp", name: "Four of Pentacles", nameFa: "\u0686\u0647\u0627\u0631 \u0633\u06A9\u0647", suit: "pentacles", rank: "four", isMajor: false },
  { id: 40, fileName: "pentacles-five.webp", name: "Five of Pentacles", nameFa: "\u067E\u0646\u062C \u0633\u06A9\u0647", suit: "pentacles", rank: "five", isMajor: false },
  { id: 41, fileName: "pentacles-six.webp", name: "Six of Pentacles", nameFa: "\u0634\u0634 \u0633\u06A9\u0647", suit: "pentacles", rank: "six", isMajor: false },
  { id: 42, fileName: "pentacles-seven.webp", name: "Seven of Pentacles", nameFa: "\u0647\u0641\u062A \u0633\u06A9\u0647", suit: "pentacles", rank: "seven", isMajor: false },
  { id: 43, fileName: "pentacles-eight.webp", name: "Eight of Pentacles", nameFa: "\u0647\u0634\u062A \u0633\u06A9\u0647", suit: "pentacles", rank: "eight", isMajor: false },
  { id: 44, fileName: "pentacles-nine.webp", name: "Nine of Pentacles", nameFa: "\u0646\u0647 \u0633\u06A9\u0647", suit: "pentacles", rank: "nine", isMajor: false },
  { id: 45, fileName: "pentacles-ten.webp", name: "Ten of Pentacles", nameFa: "\u062F\u0647 \u0633\u06A9\u0647", suit: "pentacles", rank: "ten", isMajor: false },
  { id: 46, fileName: "pentacles-page.webp", name: "Page of Pentacles", nameFa: "\u0633\u0631\u0628\u0627\u0632 \u0633\u06A9\u0647", suit: "pentacles", rank: "page", isMajor: false },
  { id: 47, fileName: "pentacles-knight.webp", name: "Knight of Pentacles", nameFa: "\u0634\u0648\u0627\u0644\u06CC\u0647 \u0633\u06A9\u0647", suit: "pentacles", rank: "knight", isMajor: false },
  { id: 48, fileName: "pentacles-queen.webp", name: "Queen of Pentacles", nameFa: "\u0645\u0644\u06A9\u0647 \u0633\u06A9\u0647", suit: "pentacles", rank: "queen", isMajor: false },
  { id: 49, fileName: "pentacles-king.webp", name: "King of Pentacles", nameFa: "\u0634\u0627\u0647 \u0633\u06A9\u0647", suit: "pentacles", rank: "king", isMajor: false },

  // ================= SWORDS (50-63) =================
  { id: 50, fileName: "swords-ace.webp", name: "Ace of Swords", nameFa: "\u0622\u0633 \u0634\u0645\u0634\u06CC\u0631", suit: "swords", rank: "ace", isMajor: false },
  { id: 51, fileName: "swords-two.webp", name: "Two of Swords", nameFa: "\u062F\u0648 \u0634\u0645\u0634\u06CC\u0631", suit: "swords", rank: "two", isMajor: false },
  { id: 52, fileName: "swords-three.webp", name: "Three of Swords", nameFa: "\u0633\u0647 \u0634\u0645\u0634\u06CC\u0631", suit: "swords", rank: "three", isMajor: false },
  { id: 53, fileName: "swords-four.webp", name: "Four of Swords", nameFa: "\u0686\u0647\u0627\u0631 \u0634\u0645\u0634\u06CC\u0631", suit: "swords", rank: "four", isMajor: false },
  { id: 54, fileName: "swords-five.webp", name: "Five of Swords", nameFa: "\u067E\u0646\u062C \u0634\u0645\u0634\u06CC\u0631", suit: "swords", rank: "five", isMajor: false },
  { id: 55, fileName: "swords-six.webp", name: "Six of Swords", nameFa: "\u0634\u0634 \u0634\u0645\u0634\u06CC\u0631", suit: "swords", rank: "six", isMajor: false },
  { id: 56, fileName: "swords-seven.webp", name: "Seven of Swords", nameFa: "\u0647\u0641\u062A \u0634\u0645\u0634\u06CC\u0631", suit: "swords", rank: "seven", isMajor: false },
  { id: 57, fileName: "swords-eight.webp", name: "Eight of Swords", nameFa: "\u0647\u0634\u062A \u0634\u0645\u0634\u06CC\u0631", suit: "swords", rank: "eight", isMajor: false },
  { id: 58, fileName: "swords-nine.webp", name: "Nine of Swords", nameFa: "\u0646\u0647 \u0634\u0645\u0634\u06CC\u0631", suit: "swords", rank: "nine", isMajor: false },
  { id: 59, fileName: "swords-ten.webp", name: "Ten of Swords", nameFa: "\u062F\u0647 \u0634\u0645\u0634\u06CC\u0631", suit: "swords", rank: "ten", isMajor: false },
  { id: 60, fileName: "swords-page.webp", name: "Page of Swords", nameFa: "\u0633\u0631\u0628\u0627\u0632 \u0634\u0645\u0634\u06CC\u0631", suit: "swords", rank: "page", isMajor: false },
  { id: 61, fileName: "swords-knight.webp", name: "Knight of Swords", nameFa: "\u0634\u0648\u0627\u0644\u06CC\u0647 \u0634\u0645\u0634\u06CC\u0631", suit: "swords", rank: "knight", isMajor: false },
  { id: 62, fileName: "swords-queen.webp", name: "Queen of Swords", nameFa: "\u0645\u0644\u06A9\u0647 \u0634\u0645\u0634\u06CC\u0631", suit: "swords", rank: "queen", isMajor: false },
  { id: 63, fileName: "swords-king.webp", name: "King of Swords", nameFa: "\u0634\u0627\u0647 \u0634\u0645\u0634\u06CC\u0631", suit: "swords", rank: "king", isMajor: false },

  // ================= WANDS (64-77) =================
  { id: 64, fileName: "wands-ace.webp", name: "Ace of Wands", nameFa: "\u0622\u0633 \u0639\u0635\u0627", suit: "wands", rank: "ace", isMajor: false },
  { id: 65, fileName: "wands-two.webp", name: "Two of Wands", nameFa: "\u062F\u0648 \u0639\u0635\u0627", suit: "wands", rank: "two", isMajor: false },
  { id: 66, fileName: "wands-three.webp", name: "Three of Wands", nameFa: "\u0633\u0647 \u0639\u0635\u0627", suit: "wands", rank: "three", isMajor: false },
  { id: 67, fileName: "wands-four.webp", name: "Four of Wands", nameFa: "\u0686\u0647\u0627\u0631 \u0639\u0635\u0627", suit: "wands", rank: "four", isMajor: false },
  { id: 68, fileName: "wands-five.webp", name: "Five of Wands", nameFa: "\u067E\u0646\u062C \u0639\u0635\u0627", suit: "wands", rank: "five", isMajor: false },
  { id: 69, fileName: "wands-six.webp", name: "Six of Wands", nameFa: "\u0634\u0634 \u0639\u0635\u0627", suit: "wands", rank: "six", isMajor: false },
  { id: 70, fileName: "wands-seven.webp", name: "Seven of Wands", nameFa: "\u0647\u0641\u062A \u0639\u0635\u0627", suit: "wands", rank: "seven", isMajor: false },
  { id: 71, fileName: "wands-eight.webp", name: "Eight of Wands", nameFa: "\u0647\u0634\u062A \u0639\u0635\u0627", suit: "wands", rank: "eight", isMajor: false },
  { id: 72, fileName: "wands-nine.webp", name: "Nine of Wands", nameFa: "\u0646\u0647 \u0639\u0635\u0627", suit: "wands", rank: "nine", isMajor: false },
  { id: 73, fileName: "wands-ten.webp", name: "Ten of Wands", nameFa: "\u062F\u0647 \u0639\u0635\u0627", suit: "wands", rank: "ten", isMajor: false },
  { id: 74, fileName: "wands-page.webp", name: "Page of Wands", nameFa: "\u0633\u0631\u0628\u0627\u0632 \u0639\u0635\u0627", suit: "wands", rank: "page", isMajor: false },
  { id: 75, fileName: "wands-knight.webp", name: "Knight of Wands", nameFa: "\u0634\u0648\u0627\u0644\u06CC\u0647 \u0639\u0635\u0627", suit: "wands", rank: "knight", isMajor: false },
  { id: 76, fileName: "wands-queen.webp", name: "Queen of Wands", nameFa: "\u0645\u0644\u06A9\u0647 \u0639\u0635\u0627", suit: "wands", rank: "queen", isMajor: false },
  { id: 77, fileName: "wands-king.webp", name: "King of Wands", nameFa: "\u0634\u0627\u0647 \u0639\u0635\u0627", suit: "wands", rank: "king", isMajor: false },
];