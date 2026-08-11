import { useState, useEffect, useMemo, useRef } from "react";
import { Plus, Search, X, Trash2, Pencil, Mail, Copy, Check } from "lucide-react";
import { storage } from "./storage";

const STAGES = ["Researching", "Emailed", "Replied", "Call scheduled", "Visited", "Offer"];
const DIVISIONS = ["D1", "D2", "D3", "NAIA", "JUCO"];

const COLLEGES = [
  ["Stanford", "D1"], ["UCLA", "D1"], ["USC", "D1"], ["California", "D1"], ["Texas", "D1"],
  ["Texas A&M", "D1"], ["TCU", "D1"], ["Baylor", "D1"], ["Oklahoma", "D1"], ["Oklahoma State", "D1"],
  ["Georgia", "D1"], ["Georgia Tech", "D1"], ["Florida", "D1"], ["Florida State", "D1"], ["Miami (FL)", "D1"],
  ["North Carolina", "D1"], ["NC State", "D1"], ["Duke", "D1"], ["Wake Forest", "D1"], ["Virginia", "D1"],
  ["Virginia Tech", "D1"], ["Clemson", "D1"], ["South Carolina", "D1"], ["Tennessee", "D1"], ["Vanderbilt", "D1"],
  ["Kentucky", "D1"], ["Auburn", "D1"], ["LSU", "D1"], ["Ole Miss", "D1"], ["Mississippi State", "D1"],
  ["Arkansas", "D1"], ["Alabama", "D1"], ["Missouri", "D1"], ["Kansas", "D1"], ["Kansas State", "D1"],
  ["Iowa", "D1"], ["Iowa State", "D1"], ["Nebraska", "D1"], ["Minnesota", "D1"], ["Wisconsin", "D1"],
  ["Illinois", "D1"], ["Indiana", "D1"], ["Purdue", "D1"], ["Michigan", "D1"], ["Michigan State", "D1"],
  ["Ohio State", "D1"], ["Northwestern", "D1"], ["Penn State", "D1"], ["Rutgers", "D1"], ["Maryland", "D1"],
  ["Pittsburgh", "D1"], ["Syracuse", "D1"], ["Louisville", "D1"], ["Notre Dame", "D1"], ["Boston College", "D1"],
  ["Cornell", "D1"], ["Columbia", "D1"], ["Princeton", "D1"], ["Yale", "D1"], ["Harvard", "D1"],
  ["Penn", "D1"], ["Dartmouth", "D1"], ["Brown", "D1"], ["Pepperdine", "D1"], ["San Diego", "D1"],
  ["San Diego State", "D1"], ["Arizona", "D1"], ["Arizona State", "D1"], ["UNLV", "D1"], ["Colorado", "D1"],
  ["Utah", "D1"], ["BYU", "D1"], ["Washington", "D1"], ["Washington State", "D1"], ["Oregon", "D1"],
  ["Tulane", "D1"], ["Tulsa", "D1"], ["Wichita State", "D1"], ["Houston", "D1"], ["SMU", "D1"],
  ["Emory", "D3"], ["Williams", "D3"], ["Amherst", "D3"], ["Middlebury", "D3"], ["Washington and Lee", "D3"],
  ["Kenyon", "D3"], ["Denison", "D3"], ["University of Chicago", "D3"], ["Carnegie Mellon", "D3"],
  ["Case Western Reserve", "D3"], ["Claremont-Mudd-Scripps", "D3"], ["Pomona-Pitzer", "D3"], ["Trinity (TX)", "D3"],
  ["Johns Hopkins", "D3"], ["MIT", "D3"], ["NYU", "D3"], ["Bowdoin", "D3"], ["Wesleyan", "D3"], ["Tufts", "D3"],
  ["Bates", "D3"], ["Colby", "D3"], ["Hamilton", "D3"], ["Skidmore", "D3"], ["Swarthmore", "D3"], ["Babson", "D3"],
  ["Haverford", "D3"], ["Gustavus Adolphus", "D3"], ["DePauw", "D3"], ["Rochester", "D3"],
  ["Trinity College (CT)", "D3"], ["Connecticut College", "D3"], ["Washington University in St. Louis", "D3"],
  ["Brandeis", "D3"], ["Macalester", "D3"], ["St. Olaf", "D3"], ["Carleton", "D3"], ["Augsburg", "D3"],
  ["Hamline", "D3"], ["Bethel (MN)", "D3"], ["Concordia (MN)", "D3"], ["St. Mary's (MN)", "D3"],
  ["St. John's (MN)", "D3"], ["St. Benedict", "D3"], ["Franklin & Marshall", "D3"], ["Dickinson", "D3"],
  ["Gettysburg", "D3"], ["Muhlenberg", "D3"], ["McDaniel", "D3"], ["Ursinus", "D3"], ["Occidental", "D3"],
  ["Redlands", "D3"], ["Whittier", "D3"], ["La Verne", "D3"], ["Chapman", "D3"], ["Wooster", "D3"],
  ["Wittenberg", "D3"], ["Oberlin", "D3"], ["Wabash", "D3"], ["Ohio Wesleyan", "D3"], ["Allegheny", "D3"],
  ["Hobart and William Smith", "D3"], ["RPI", "D3"], ["Union (NY)", "D3"], ["Vassar", "D3"], ["Bard", "D3"],
  ["Clarkson", "D3"], ["St. Lawrence", "D3"], ["Roanoke", "D3"], ["Randolph-Macon", "D3"],
  ["Virginia Wesleyan", "D3"], ["Juniata", "D3"], ["Susquehanna", "D3"], ["Elizabethtown", "D3"],
  ["Moravian", "D3"], ["Southwestern", "D3"], ["Centre", "D3"], ["Rhodes", "D3"], ["Sewanee", "D3"],
  ["Whitman", "D3"], ["Willamette", "D3"], ["Lewis & Clark", "D3"], ["Puget Sound", "D3"],
  ["George Fox", "D3"], ["Linfield", "D3"], ["Pacific Lutheran", "D3"], ["Colorado College", "D3"],
  ["Barry", "D2"], ["Lynn", "D2"], ["West Florida", "D2"], ["Valdosta State", "D2"],
  ["Columbus State", "D2"], ["Flagler", "D2"], ["Rollins", "D2"], ["Florida Southern", "D2"], ["Saint Leo", "D2"],
  ["Nova Southeastern", "D2"], ["Palm Beach Atlantic", "D2"], ["Tampa", "D2"], ["Eckerd", "D2"],
  ["West Texas A&M", "D2"], ["Angelo State", "D2"], ["Midwestern State", "D2"],
  ["Cameron", "D2"], ["Eastern New Mexico", "D2"], ["Texas A&M International", "D2"], ["St. Edward's", "D2"],
  ["Georgia College", "D2"], ["Augusta University", "D2"], ["USC Aiken", "D2"], ["Young Harris", "D2"],
  ["Catawba", "D2"], ["Lenoir-Rhyne", "D2"], ["Wingate", "D2"], ["Carson-Newman", "D2"], ["Mars Hill", "D2"],
  ["Newberry", "D2"], ["Anderson (SC)", "D2"], ["Queens University of Charlotte", "D2"], ["Coker", "D2"],
  ["West Chester", "D2"], ["Millersville", "D2"], ["Kutztown", "D2"], ["East Stroudsburg", "D2"], ["Slippery Rock", "D2"],
  ["Grand Valley State", "D2"], ["Ferris State", "D2"], ["Northwood", "D2"], ["Findlay", "D2"], ["Wayne State (MI)", "D2"],
  ["Rockhurst", "D2"], ["Drury", "D2"], ["Southern Indiana", "D2"], ["Truman State", "D2"], ["Missouri S&T", "D2"],
  ["William Jewell", "D2"], ["Lincoln University (MO)", "D2"],
  ["Colorado Mesa", "D2"], ["Colorado School of Mines", "D2"], ["Western Colorado", "D2"], ["Regis University", "D2"],
  ["Metropolitan State (Denver)", "D2"], ["Colorado Christian", "D2"],
  ["Virginia Union", "D2"], ["Virginia State", "D2"], ["Bowie State", "D2"], ["Shippensburg", "D2"],
  ["Chico State", "D2"], ["Cal Poly Pomona", "D2"], ["Sonoma State", "D2"], ["Cal State San Marcos", "D2"],
  ["Central Missouri", "D2"], ["Emporia State", "D2"], ["Washburn", "D2"], ["Fort Hays State", "D2"],
  ["Delta State", "D2"], ["Mississippi College", "D2"], ["Christian Brothers", "D2"], ["Union University", "D2"],
  ["Abilene Christian", "D1"], ["Texas State", "D1"], ["UTSA", "D1"], ["North Texas", "D1"], ["Central Florida", "D1"],
  ["Georgia Southern", "D1"], ["Georgia State", "D1"], ["Furman", "D1"], ["Wofford", "D1"], ["Elon", "D1"],
  ["Davidson", "D1"], ["Charleston", "D1"], ["William & Mary", "D1"], ["Richmond", "D1"], ["James Madison", "D1"],
  ["Old Dominion", "D1"], ["George Washington", "D1"], ["George Mason", "D1"], ["American", "D1"],
  ["Navy", "D1"], ["Army West Point", "D1"], ["Air Force", "D1"], ["Tarleton State", "D1"], ["Lindenwood", "D1"],
  ["Georgia Gwinnett", "NAIA"], ["Union (TN)", "NAIA"], ["Cumberlands", "NAIA"],
  ["Oklahoma City", "NAIA"], ["Southeastern", "NAIA"], ["Life", "NAIA"], ["Keiser", "NAIA"],
];

const DIVISION_RANGES = {
  D1: [9, 13],
  D2: [7.5, 10.5],
  D3: [6, 9.5],
  NAIA: [6.5, 10],
  JUCO: [5.5, 9],
};

// Per-school overrides for programs where the division-wide range badly
// understates how competitive recruiting actually is (e.g. Stanford vs.
// a directional D1 school are both "D1" but nothing alike). Add more
// schools here any time — anything not listed just falls back to its
// division's range.
const SCHOOL_UTR_OVERRIDE = {
  // Ivy / elite-academic D1 tier (pre-existing)
  Harvard: [11, 13],
  Yale: [11, 13],
  Princeton: [11, 13],
  Penn: [10.5, 13],
  Brown: [10.5, 13],
  Dartmouth: [10.5, 13],
  Duke: [10.5, 13],
  Vanderbilt: [10.5, 13],
  Northwestern: [10, 13],
  MIT: [10, 13],

  // D1 UTR power-ranking top 10 — the very hardest programs to make
  Stanford: [11.5, 13],
  Virginia: [11.5, 13],
  "Wake Forest": [11.5, 13],
  "Ohio State": [11.5, 13],
  Texas: [11.5, 13],
  TCU: [11.5, 13],
  Arizona: [11.5, 13],
  "Mississippi State": [11.5, 13],
  Oklahoma: [11.5, 13],
  LSU: [11.5, 13],

  // D1 UTR power-ranking 11-30 — well above the typical D1 bar
  "San Diego": [10.5, 13],
  Illinois: [10.5, 13],
  Georgia: [10.5, 13],
  Baylor: [10.5, 13],
  UCLA: [10.5, 13],
  "Michigan State": [10.5, 13],
  "Texas A&M": [10.5, 13],
  USC: [10.5, 13],
  "Notre Dame": [10.5, 13],
  Columbia: [10.5, 13],
  "Central Florida": [10.5, 13],
  Pepperdine: [10.5, 13],
  "South Carolina": [10.5, 13],
  Cornell: [10.5, 13],
  Florida: [10.5, 13],
  "NC State": [10.5, 13],
  Clemson: [10.5, 13],
  "Ole Miss": [10.5, 13],
  "North Carolina": [10.5, 13],

  // D3 UTR power-ranking top 10 — treated as equivalent to low/mid D1,
  // well above a typical D3 program
  "University of Chicago": [9.5, 12],
  Tufts: [9.5, 12],
  "Claremont-Mudd-Scripps": [9.5, 12],
  Denison: [9.5, 12],
  Bowdoin: [9.5, 12],
  "Case Western Reserve": [9.5, 12],
  Amherst: [9.5, 12],
  Swarthmore: [9.5, 12],
  Babson: [9.5, 12],
  Middlebury: [9.5, 12],
};

function classifyDivision(utrStr, division, schoolName) {
  const utr = parseFloat(utrStr);
  const range = (schoolName && SCHOOL_UTR_OVERRIDE[schoolName]) || DIVISION_RANGES[division];
  if (!range || isNaN(utr)) return null;
  const [lo, hi] = range;
  if (utr < lo - 0.5) return "reach";
  if (utr <= hi) return "target";
  return "likely";
}

const CLASS_STYLE = {
  reach: { bg: "#FCEBEA", text: "#B23A2E", label: "Reach" },
  target: { bg: "#E9F3E9", text: "#2F6B33", label: "Target" },
  likely: { bg: "#FBF0DC", text: "#8A5A12", label: "Likely" },
};

// First wave of researched school data — acceptance rate, conference, academics, tennis note.
// "verified" = specifically looked up; "general" = well-established public
// figures that are slower-changing but should still be double-checked for
// the current admissions cycle. Tennis notes describe long-run program
// reputation, NOT this week's ranking — rankings shift constantly and
// aren't reliably kept current here. This directory is intentionally
// partial — a sample across selectivity levels, not all 101 D1 schools.
const SCHOOL_INFO = {
  "Duke": { acceptanceRate: "~5% (verified, Class of 2030)", conference: "ACC", academics: "Elite private research university, ~6,600 undergrads", tennisNote: "Consistently strong ACC program, frequent NCAA tournament team", deadlineInfo: "ED ~Nov 1; RD ~Jan 5 (verified pattern, 2026-27 cycle)" },
  "Notre Dame": { acceptanceRate: "~9% (verified, Class of 2030)", conference: "ACC (all sports except football)", academics: "Elite private university, ~8,800 undergrads", tennisNote: "Competitive ACC program, regular NCAA qualifier", deadlineInfo: "REA ~Nov 1; RD ~Jan 1 (verified pattern, 2026-27 cycle)" },
  "Vanderbilt": { acceptanceRate: "~3% RD (verified, Class of 2030)", conference: "SEC", academics: "Elite private research university, ~7,000 undergrads", tennisNote: "Historically one of the sport's strongest programs, multiple SEC and national titles", deadlineInfo: "ED I ~Nov 1; ED II ~Jan 1; RD ~Jan 1 (verified pattern, 2026-27 cycle)" },
  "Northwestern": { acceptanceRate: "~7% (verified, Class of 2029)", conference: "Big Ten", academics: "Elite private research university, ~8,700 undergrads", tennisNote: "Competitive Big Ten program, frequent NCAA qualifier", deadlineInfo: "ED I ~Nov 1; ED II ~Jan 2; RD ~Jan 2 (verified pattern, 2026-27 cycle)" },
  "Stanford": { acceptanceRate: "~4% (general \u2014 Stanford doesn't publish exact figures)", conference: "ACC (joined 2024)", academics: "Elite private research university, ~7,800 undergrads", tennisNote: "One of the most decorated programs in NCAA history, men's and women's", deadlineInfo: "REA ~Nov 1; RD ~Jan 5 (verified pattern, 2026-27 cycle)" },
  "Georgia": { acceptanceRate: "~40% (general)", conference: "SEC", academics: "Large public flagship, ~30,000 undergrads", tennisNote: "Perennial national power, multiple NCAA titles, hosts the NCAA Championships", deadlineInfo: "EA ~Oct 15; RD ~Jan 1 (general)" },
  "Virginia": { acceptanceRate: "~19% (general)", conference: "ACC", academics: "Public flagship, ~17,000 undergrads", tennisNote: "Dominant men's program of the last decade, multiple national titles", deadlineInfo: "EA ~Nov 1; RD ~Jan 1 (general)" },
  "North Carolina": { acceptanceRate: "~17% (general)", conference: "ACC", academics: "Public flagship, ~19,000 undergrads", tennisNote: "Strong, consistently ranked ACC program", deadlineInfo: "EA ~Oct 15; RD ~Jan 15 (general)" },
  "Florida": { acceptanceRate: "~23% (general)", conference: "SEC", academics: "Large public flagship, ~35,000 undergrads", tennisNote: "Historically strong SEC program on both sides", deadlineInfo: "Priority ~Nov 1 (general)" },
  "Florida State": { acceptanceRate: "~25% (general)", conference: "ACC", academics: "Large public university, ~32,000 undergrads", tennisNote: "Competitive, regularly ranked ACC program", deadlineInfo: "Priority ~Nov 1 (general)" },
  "Texas": { acceptanceRate: "~29% (general)", conference: "SEC", academics: "Large public flagship, ~42,000 undergrads", tennisNote: "Traditionally elite program, multiple national titles", deadlineInfo: "Priority ~Oct 15; RD ~Dec 1 (general)" },
  "Texas A&M": { acceptanceRate: "~63% (general)", conference: "SEC", academics: "Large public flagship, ~58,000 undergrads", tennisNote: "Competitive, regularly ranked SEC program", deadlineInfo: "Priority ~Oct 15; RD ~Dec 1 (general)" },
  "USC": { acceptanceRate: "~10% (general)", conference: "Big Ten (joined 2024)", academics: "Large private research university, ~20,000 undergrads", tennisNote: "Historic powerhouse \u2014 most NCAA men's team titles of any program", deadlineInfo: "ED ~Nov 1; RD ~Jan 15 (general)" },
  "UCLA": { acceptanceRate: "~9% (general)", conference: "Big Ten (joined 2024)", academics: "Large public university, ~33,000 undergrads", tennisNote: "Historic powerhouse, multiple national titles", deadlineInfo: "No ED/EA (UC system) — single filing period, ~Nov 30 (general)" },
  "Michigan": { acceptanceRate: "~18% (general)", conference: "Big Ten", academics: "Large public flagship, ~32,000 undergrads", tennisNote: "Competitive, consistently ranked Big Ten program", deadlineInfo: "EA ~Nov 1; RD ~Feb 1 (general)" },
  "Ohio State": { acceptanceRate: "~44% (general)", conference: "Big Ten", academics: "Very large public university, ~48,000 undergrads", tennisNote: "Strong Big Ten program, regular national title contender", deadlineInfo: "EA ~Nov 1; RD ~Feb 1 (general)" },
  "Wisconsin": { acceptanceRate: "~43% (general)", conference: "Big Ten", academics: "Large public flagship, ~35,000 undergrads", tennisNote: "Competitive Big Ten program", deadlineInfo: "EA ~Nov 1; RD ~Feb 1 (verified pattern, 2026-27 cycle)" },
  "Tennessee": { acceptanceRate: "~37% (general)", conference: "SEC", academics: "Large public flagship, ~30,000 undergrads", tennisNote: "Strong, consistently ranked SEC program", deadlineInfo: "Priority ~Nov 1 (general)" },
  "Kentucky": { acceptanceRate: "~91% (general)", conference: "SEC", academics: "Large public flagship, ~24,000 undergrads", tennisNote: "Competitive SEC program", deadlineInfo: "Rolling admission (general)" },
  "Auburn": { acceptanceRate: "~44% (general)", conference: "SEC", academics: "Large public flagship, ~26,000 undergrads", tennisNote: "Competitive SEC program", deadlineInfo: "Priority ~Nov 1 (general)" },
  "Clemson": { acceptanceRate: "~30% (general)", conference: "ACC", academics: "Large public university, ~21,000 undergrads", tennisNote: "Competitive ACC program", deadlineInfo: "EA ~Nov 1; RD ~Jan 15 (general)" },
  "Wake Forest": { acceptanceRate: "~22% (general)", conference: "ACC", academics: "Private university, ~5,500 undergrads", tennisNote: "Strong ACC program, frequent national title contender", deadlineInfo: "ED ~Nov 15; RD ~Jan 1 (general)" },
  "Baylor": { acceptanceRate: "~45% (general)", conference: "Big 12", academics: "Private university, ~14,000 undergrads", tennisNote: "Traditionally one of the strongest Big 12 programs", deadlineInfo: "Priority ~Nov 1 (general)" },
  "TCU": { acceptanceRate: "~47% (general)", conference: "Big 12", academics: "Private university, ~10,000 undergrads", tennisNote: "Competitive, regularly ranked Big 12 program", deadlineInfo: "Priority ~Nov 1 (general)" },
  "Oklahoma": { acceptanceRate: "~80% (general)", conference: "SEC", academics: "Large public flagship, ~23,000 undergrads", tennisNote: "Competitive program within a strong conference", deadlineInfo: "Priority ~Dec 1 (general)" },
  "Arkansas": { acceptanceRate: "~76% (general)", conference: "SEC", academics: "Large public flagship, ~24,000 undergrads", tennisNote: "Competitive SEC program", deadlineInfo: "Priority ~Nov 1, rolling (general)" },
  "Penn State": { acceptanceRate: "~49% (general)", conference: "Big Ten", academics: "Very large public flagship, ~40,000 undergrads", tennisNote: "Competitive Big Ten program", deadlineInfo: "EA ~Nov 1; RD ~Feb 1 (general)" },

  // Wave 2
  "California": { acceptanceRate: "~11% (general)", conference: "ACC (joined 2024)", academics: "Large public flagship (UC Berkeley), ~33,000 undergrads", tennisNote: "Historically strong program with a deep alumni pedigree", deadlineInfo: "No ED/EA (UC system) — single filing period, ~Nov 30 (general)" },
  "Oklahoma State": { acceptanceRate: "~72% (general)", conference: "Big 12", academics: "Large public university, ~21,000 undergrads", tennisNote: "Competitive Big 12 program", deadlineInfo: "Priority ~Dec 1 (general)" },
  "Georgia Tech": { acceptanceRate: "~16% (verified, Class of 2029)", conference: "ACC", academics: "Public STEM-focused research university, ~18,000 undergrads", tennisNote: "Competitive ACC program", deadlineInfo: "EA ~Oct 15 (verified pattern); RD ~Jan 4 (general)" },
  "Miami (FL)": { acceptanceRate: "~19% (verified, 2025-26 cycle)", conference: "ACC", academics: "Private research university, ~12,000 undergrads", tennisNote: "Competitive ACC program", deadlineInfo: "ED ~Nov 1; RD ~Jan 15 (general)" },
  "NC State": { acceptanceRate: "~44% (general)", conference: "ACC", academics: "Large public university, ~27,000 undergrads", tennisNote: "Competitive ACC program", deadlineInfo: "EA ~Oct 15; RD ~Jan 15 (general)" },
  "Virginia Tech": { acceptanceRate: "~54% (general)", conference: "ACC", academics: "Large public university, ~30,000 undergrads", tennisNote: "Competitive ACC program", deadlineInfo: "EA ~Nov 1; RD ~Jan 15 (general)" },
  "South Carolina": { acceptanceRate: "~64% (general)", conference: "SEC", academics: "Large public flagship, ~28,000 undergrads", tennisNote: "Competitive SEC program", deadlineInfo: "Priority ~Dec 1 (general)" },
  "LSU": { acceptanceRate: "~72% (general)", conference: "SEC", academics: "Large public flagship, ~30,000 undergrads", tennisNote: "Competitive SEC program", deadlineInfo: "Priority ~Nov 1 (general)" },
  "Ole Miss": { acceptanceRate: "~92% (general)", conference: "SEC", academics: "Large public flagship, ~22,000 undergrads", tennisNote: "Competitive SEC program", deadlineInfo: "Priority ~Nov 1, rolling after (general)" },
  "Mississippi State": { acceptanceRate: "~74% (general)", conference: "SEC", academics: "Large public flagship, ~19,000 undergrads", tennisNote: "Competitive SEC program", deadlineInfo: "Rolling, priority ~Nov 1 (general)" },
  "Alabama": { acceptanceRate: "~72% (general)", conference: "SEC", academics: "Very large public flagship, ~33,000 undergrads", tennisNote: "Competitive SEC program", deadlineInfo: "Priority ~Dec 1, rolling (general)" },
  "Missouri": { acceptanceRate: "~78% (general)", conference: "SEC", academics: "Large public flagship, ~24,000 undergrads", tennisNote: "Competitive SEC program", deadlineInfo: "Rolling, priority ~Dec 1 (general)" },
  "Kansas": { acceptanceRate: "~88% (general)", conference: "Big 12", academics: "Large public flagship, ~19,000 undergrads", tennisNote: "Competitive Big 12 program", deadlineInfo: "Rolling admission (general)" },
  "Kansas State": { acceptanceRate: "~93% (general)", conference: "Big 12", academics: "Public flagship, ~15,000 undergrads", tennisNote: "Competitive Big 12 program", deadlineInfo: "Rolling admission (general)" },
  "Iowa": { acceptanceRate: "~82% (general)", conference: "Big Ten", academics: "Large public flagship, ~22,000 undergrads", tennisNote: "Competitive Big Ten program", deadlineInfo: "Priority ~Dec 1, rolling (general)" },
  "Iowa State": { acceptanceRate: "~88% (general)", conference: "Big 12", academics: "Large public university, ~26,000 undergrads", tennisNote: "Competitive Big 12 program", deadlineInfo: "Rolling admission (general)" },
  "Nebraska": { acceptanceRate: "~78% (general)", conference: "Big Ten", academics: "Public flagship, ~19,000 undergrads", tennisNote: "Competitive Big Ten program", deadlineInfo: "Priority ~Dec 1, rolling (general)" },
  "Minnesota": { acceptanceRate: "~68% (general)", conference: "Big Ten", academics: "Very large public flagship, ~34,000 undergrads", tennisNote: "Competitive Big Ten program", deadlineInfo: "Priority ~Dec 15 (general)" },
  "Illinois": { acceptanceRate: "~44% (general)", conference: "Big Ten", academics: "Very large public flagship, ~35,000 undergrads", tennisNote: "Historically strong, consistently ranked Big Ten program", deadlineInfo: "Priority ~Nov 1 (general)" },
  "Indiana": { acceptanceRate: "~76% (general)", conference: "Big Ten", academics: "Very large public flagship, ~35,000 undergrads", tennisNote: "Competitive Big Ten program", deadlineInfo: "Priority ~Nov 1, rolling (general)" },
  "Purdue": { acceptanceRate: "~53% (general)", conference: "Big Ten", academics: "Very large public university, ~35,000 undergrads", tennisNote: "Competitive Big Ten program", deadlineInfo: "Priority ~Nov 1 (general)" },
  "Michigan State": { acceptanceRate: "~76% (general)", conference: "Big Ten", academics: "Very large public university, ~40,000 undergrads", tennisNote: "Competitive Big Ten program", deadlineInfo: "Priority ~Nov 1, rolling (general)" },
  "Rutgers": { acceptanceRate: "~66% (general)", conference: "Big Ten", academics: "Very large public university, ~35,000 undergrads", tennisNote: "Competitive Big Ten program", deadlineInfo: "RD ~Dec 1 (general)" },
  "Maryland": { acceptanceRate: "~44% (general)", conference: "Big Ten", academics: "Large public flagship, ~30,000 undergrads", tennisNote: "Competitive Big Ten program", deadlineInfo: "EA ~Nov 1; RD ~Jan 20 (general)" },
  "Pittsburgh": { acceptanceRate: "~48% (general)", conference: "ACC", academics: "Large public university, ~20,000 undergrads", tennisNote: "Competitive ACC program", deadlineInfo: "ED ~Nov 1; RD ~Jan 15 (general)" },

  // Wave 3
  "Syracuse": { acceptanceRate: "~44% (general)", conference: "ACC", academics: "Large private university, ~15,000 undergrads", tennisNote: "Competitive ACC program", deadlineInfo: "ED ~Nov 15; RD ~Jan 15 (general)" },
  "Louisville": { acceptanceRate: "~74% (general)", conference: "ACC", academics: "Large public university, ~16,000 undergrads", tennisNote: "Competitive ACC program", deadlineInfo: "Priority ~Dec 1, rolling (general)" },
  "Boston College": { acceptanceRate: "~15% (general)", conference: "ACC", academics: "Private university, ~9,500 undergrads", tennisNote: "Competitive ACC program", deadlineInfo: "ED I ~Nov 1; ED II ~Jan 1; RD ~Jan 1 (general)" },
  "Cornell": { acceptanceRate: "~7% (verified, Class of 2030 estimate)", conference: "Ivy League", academics: "Private research university, ~15,000 undergrads", tennisNote: "Competitive Ivy League program", deadlineInfo: "ED ~Nov 1; RD ~Jan 2 (verified pattern, 2026-27 cycle)" },
  "Columbia": { acceptanceRate: "~4.2% (verified, Class of 2030)", conference: "Ivy League", academics: "Private research university, ~9,000 undergrads", tennisNote: "Highly selective Ivy League program", deadlineInfo: "ED ~Nov 1; RD ~Jan 1 (verified pattern, 2026-27 cycle)" },
  "Princeton": { acceptanceRate: "~4% (general \u2014 withheld official Class of 2030 data)", conference: "Ivy League", academics: "Private research university, ~5,600 undergrads", tennisNote: "Highly selective Ivy League program", deadlineInfo: "SCEA ~Nov 1; RD ~Jan 1 (verified pattern, 2026-27 cycle)" },
  "Yale": { acceptanceRate: "~4.2% (verified, Class of 2030)", conference: "Ivy League", academics: "Private research university, ~6,700 undergrads", tennisNote: "Highly selective Ivy League program", deadlineInfo: "SCEA ~Nov 1; RD ~Jan 2 (verified pattern, 2026-27 cycle)" },
  "Harvard": { acceptanceRate: "~3-4% (general \u2014 withheld official Class of 2030 data)", conference: "Ivy League", academics: "Private research university, ~7,100 undergrads", tennisNote: "Highly selective Ivy League program", deadlineInfo: "REA ~Nov 1; RD ~Jan 1 (verified pattern, 2026-27 cycle)" },
  "Penn": { acceptanceRate: "~5% (general)", conference: "Ivy League", academics: "Private research university, ~10,500 undergrads", tennisNote: "Highly selective Ivy League program", deadlineInfo: "ED ~Nov 1; RD ~Jan 5 (verified pattern, 2026-27 cycle)" },
  "Dartmouth": { acceptanceRate: "~6% (general, Class of 2029 figure \u2014 2030 unreleased)", conference: "Ivy League", academics: "Private university, ~4,500 undergrads", tennisNote: "Highly selective Ivy League program", deadlineInfo: "ED ~Nov 1; RD ~Jan 3 (verified pattern, 2026-27 cycle)" },
  "Brown": { acceptanceRate: "~5.4% (verified, Class of 2030)", conference: "Ivy League", academics: "Private research university, ~7,200 undergrads", tennisNote: "Highly selective Ivy League program", deadlineInfo: "ED ~Nov 1; RD ~Jan 5 (verified pattern, 2026-27 cycle)" },
  "Pepperdine": { acceptanceRate: "~35% (general)", conference: "West Coast Conference", academics: "Private university, ~3,700 undergrads", tennisNote: "Competitive WCC program", deadlineInfo: "EA ~Nov 1; RD ~Jan 5 (general)" },
  "San Diego": { acceptanceRate: "~50% (general)", conference: "West Coast Conference", academics: "Private university, ~5,800 undergrads", tennisNote: "Competitive WCC program", deadlineInfo: "EA ~Nov 1; RD ~Jan 15 (general)" },
  "San Diego State": { acceptanceRate: "~53% (general)", conference: "Mountain West", academics: "Large public university, ~30,000 undergrads", tennisNote: "Competitive Mountain West program", deadlineInfo: "RD ~Nov 30 (Cal State system, general)" },
  "Arizona": { acceptanceRate: "~85% (general)", conference: "Big 12 (joined 2024)", academics: "Large public flagship, ~35,000 undergrads", tennisNote: "Competitive Big 12 program", deadlineInfo: "Priority ~Nov 1, rolling (general)" },
  "Arizona State": { acceptanceRate: "~90% (general)", conference: "Big 12 (joined 2024)", academics: "Very large public university, ~55,000 undergrads", tennisNote: "Competitive Big 12 program", deadlineInfo: "Rolling admission (general)" },
  "UNLV": { acceptanceRate: "~87% (general)", conference: "Mountain West", academics: "Large public university, ~24,000 undergrads", tennisNote: "Competitive Mountain West program", deadlineInfo: "Rolling admission (general)" },
  "Colorado": { acceptanceRate: "~85% (general)", conference: "Big 12 (joined 2024)", academics: "Large public flagship, ~30,000 undergrads", tennisNote: "Competitive Big 12 program", deadlineInfo: "Priority ~Nov 1, rolling (general)" },
  "Utah": { acceptanceRate: "~90% (general)", conference: "Big 12 (joined 2024)", academics: "Large public flagship, ~25,000 undergrads", tennisNote: "Competitive Big 12 program", deadlineInfo: "Priority ~Dec 1, rolling (general)" },
  "BYU": { acceptanceRate: "~68% (general)", conference: "Big 12", academics: "Large private university, ~33,000 undergrads", tennisNote: "Competitive Big 12 program", deadlineInfo: "~Dec 15 (general)" },
  "Washington": { acceptanceRate: "~48% (general)", conference: "Big Ten (joined 2024)", academics: "Large public flagship, ~33,000 undergrads", tennisNote: "Competitive Big Ten program", deadlineInfo: "~Nov 15 (general)" },
  "Washington State": { acceptanceRate: "~83% (general)", conference: "Pac-12 (rebuilt 2026)", academics: "Large public university, ~24,000 undergrads", tennisNote: "Competitive program", deadlineInfo: "Rolling, priority ~Feb 1 (general)" },
  "Oregon": { acceptanceRate: "~93% (general)", conference: "Big Ten (joined 2024)", academics: "Large public flagship, ~23,000 undergrads", tennisNote: "Competitive Big Ten program", deadlineInfo: "Rolling, priority ~Nov 1 (general)" },
  "Tulane": { acceptanceRate: "~10% (general \u2014 selectivity has risen sharply in recent years)", conference: "American Athletic Conference", academics: "Private university, ~8,500 undergrads", tennisNote: "Competitive AAC program", deadlineInfo: "ED I ~Nov 1; ED II ~Jan 8; RD ~Jan 15 (general)" },
  "Tulsa": { acceptanceRate: "~42% (general)", conference: "American Athletic Conference", academics: "Private university, ~4,200 undergrads", tennisNote: "Competitive AAC program", deadlineInfo: "Priority ~Dec 1, rolling (general)" },

  // Wave 4 — completes D1
  "Wichita State": { acceptanceRate: "~90% (general)", conference: "American Athletic Conference", academics: "Large public university, ~13,000 undergrads", tennisNote: "Competitive AAC program", deadlineInfo: "Rolling admission (general)" },
  "Houston": { acceptanceRate: "~59% (general)", conference: "Big 12", academics: "Large public university, ~38,000 undergrads", tennisNote: "Competitive Big 12 program", deadlineInfo: "Priority ~Dec 1, rolling (general)" },
  "SMU": { acceptanceRate: "~53% (general)", conference: "ACC (joined 2024)", academics: "Private university, ~7,300 undergrads", tennisNote: "Competitive ACC program", deadlineInfo: "ED ~Nov 1; RD ~Jan 15 (general)" },
  "Abilene Christian": { acceptanceRate: "~46% (general)", conference: "United Athletic Conference", academics: "Private university, ~3,500 undergrads", tennisNote: "Competitive mid-major program", deadlineInfo: "Rolling admission (general)" },
  "Texas State": { acceptanceRate: "~86% (general)", conference: "Sun Belt", academics: "Large public university, ~30,000 undergrads", tennisNote: "Competitive Sun Belt program", deadlineInfo: "Priority ~Dec 1, rolling (general)" },
  "UTSA": { acceptanceRate: "~85% (general)", conference: "American Athletic Conference", academics: "Large public university, ~28,000 undergrads", tennisNote: "Competitive AAC program", deadlineInfo: "Rolling admission (general)" },
  "North Texas": { acceptanceRate: "~72% (general)", conference: "American Athletic Conference", academics: "Large public university, ~31,000 undergrads", tennisNote: "Competitive AAC program", deadlineInfo: "Priority ~Dec 1, rolling (general)" },
  "Georgia Southern": { acceptanceRate: "~90% (general)", conference: "Sun Belt", academics: "Large public university, ~20,000 undergrads", tennisNote: "Competitive Sun Belt program", deadlineInfo: "Rolling admission (general)" },
  "Georgia State": { acceptanceRate: "~72% (general)", conference: "Sun Belt", academics: "Large public university, ~25,000 undergrads", tennisNote: "Competitive Sun Belt program", deadlineInfo: "Rolling admission (general)" },
  "Furman": { acceptanceRate: "~65% (general)", conference: "Southern Conference", academics: "Private university, ~2,700 undergrads", tennisNote: "Competitive SoCon program", deadlineInfo: "ED ~Nov 15; RD ~Jan 15 (general)" },
  "Wofford": { acceptanceRate: "~55% (general)", conference: "Southern Conference", academics: "Private university, ~1,700 undergrads", tennisNote: "Competitive SoCon program", deadlineInfo: "Rolling, priority ~Dec 1 (general)" },
  "Elon": { acceptanceRate: "~72% (general)", conference: "Colonial Athletic Association", academics: "Private university, ~7,300 undergrads", tennisNote: "Competitive CAA program", deadlineInfo: "ED ~Nov 15; RD ~Jan 10 (general)" },
  "Davidson": { acceptanceRate: "~17% (general)", conference: "Atlantic 10", academics: "Private liberal arts college, ~2,000 undergrads", tennisNote: "Competitive A-10 program, strong academics", deadlineInfo: "ED ~Nov 15; RD ~Jan 2 (general)" },
  "Charleston": { acceptanceRate: "~78% (general)", conference: "Coastal Athletic Association", academics: "Public university, ~11,000 undergrads", tennisNote: "Competitive CAA program", deadlineInfo: "Priority ~Dec 1, rolling (general)" },
  "William & Mary": { acceptanceRate: "~33% (general)", conference: "Coastal Athletic Association", academics: "Public university, ~6,500 undergrads \u2014 strong academics", tennisNote: "Competitive CAA program", deadlineInfo: "EA ~Nov 1; RD ~Jan 1 (general)" },
  "Richmond": { acceptanceRate: "~24% (general)", conference: "Atlantic 10", academics: "Private university, ~3,200 undergrads", tennisNote: "Competitive A-10 program", deadlineInfo: "ED ~Nov 15; RD ~Jan 15 (general)" },
  "James Madison": { acceptanceRate: "~78% (general)", conference: "Sun Belt", academics: "Large public university, ~20,000 undergrads", tennisNote: "Competitive Sun Belt program", deadlineInfo: "Priority ~Dec 1, rolling (general)" },
  "Old Dominion": { acceptanceRate: "~90% (general)", conference: "Sun Belt", academics: "Large public university, ~18,000 undergrads", tennisNote: "Competitive Sun Belt program", deadlineInfo: "Rolling admission (general)" },
  "George Washington": { acceptanceRate: "~49% (general)", conference: "Atlantic 10", academics: "Private university, ~11,000 undergrads", tennisNote: "Competitive A-10 program", deadlineInfo: "ED ~Nov 1; RD ~Jan 15 (general)" },
  "George Mason": { acceptanceRate: "~90% (general)", conference: "Atlantic 10", academics: "Large public university, ~25,000 undergrads", tennisNote: "Competitive A-10 program", deadlineInfo: "Priority ~Dec 1, rolling (general)" },
  "American": { acceptanceRate: "~43% (general)", conference: "Patriot League", academics: "Private university, ~7,900 undergrads", tennisNote: "Competitive Patriot League program", deadlineInfo: "ED ~Nov 15; RD ~Jan 15 (general)" },
  "Navy": { acceptanceRate: "Not a standard acceptance rate \u2014 requires a congressional nomination plus medical/fitness clearance", conference: "Patriot League", academics: "Public service academy, ~4,500 undergrads; 5-year active-duty service commitment after graduation", tennisNote: "Competitive Patriot League program", deadlineInfo: "Nomination-based process — application ~Jan 31, congressional nomination required separately (verify with a Blue and Gold Officer)" },
  "Army West Point": { acceptanceRate: "Not a standard acceptance rate \u2014 requires a congressional nomination plus medical/fitness clearance", conference: "Patriot League", academics: "Public service academy, ~4,400 undergrads; active-duty service commitment after graduation", tennisNote: "Competitive Patriot League program", deadlineInfo: "Nomination-based process — application ~Jan 31, congressional nomination required separately (verify with an admissions liaison officer)" },
  "Air Force": { acceptanceRate: "Not a standard acceptance rate \u2014 requires a congressional nomination plus medical/fitness clearance", conference: "Mountain West", academics: "Public service academy, ~4,200 undergrads; active-duty service commitment after graduation", tennisNote: "Competitive Mountain West program", deadlineInfo: "Nomination-based process — application ~Jan 31, congressional nomination required separately (verify with an admissions liaison officer)" },
  "Central Florida": { acceptanceRate: "~37% (general)", conference: "Big 12", academics: "Very large public university, ~55,000 undergrads", tennisNote: "Nationally ranked Big 12 program", deadlineInfo: "Priority ~Nov 1, rolling (general)" },
  "Babson": { acceptanceRate: "~22% (general)", conference: "NEWMAC", academics: "Private business-focused college, ~2,700 undergrads", tennisNote: "Nationally ranked D3 program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 15; RD ~Jan 15 (general)" },
  "Tarleton State": { acceptanceRate: "~62% (general)", conference: "United Athletic Conference (WAC)", academics: "Public university, ~14,000 undergrads", tennisNote: "Reclassified from D2 to D1 in the early 2020s", deadlineInfo: "Rolling admission (general)" },

  // D2 Wave 1
  "Barry": { acceptanceRate: "~74% (general)", conference: "Sunshine State Conference", academics: "Private Catholic university, ~4,500 undergrads", tennisNote: "Competitive SSC program", deadlineInfo: "Rolling admission, priority ~Dec 1 (general)" },
  "Lynn": { acceptanceRate: "~78% (general)", conference: "Sunshine State Conference", academics: "Private university, ~2,700 undergrads", tennisNote: "Historically one of the most decorated D2 tennis programs in the country, heavily international roster", deadlineInfo: "Rolling admission (general)" },
  "West Florida": { acceptanceRate: "~65% (general)", conference: "Gulf South Conference", academics: "Public university, ~10,000 undergrads", tennisNote: "Competitive Gulf South program", deadlineInfo: "Rolling admission, priority ~Dec 1 (general)" },
  "Valdosta State": { acceptanceRate: "~48% (general)", conference: "Gulf South Conference", academics: "Public university, ~9,500 undergrads", tennisNote: "Competitive Gulf South program", deadlineInfo: "Rolling admission (general)" },
  "Columbus State": { acceptanceRate: "~50% (general)", conference: "Peach Belt Conference", academics: "Public university, ~6,500 undergrads", tennisNote: "Competitive Peach Belt program", deadlineInfo: "Rolling admission (general)" },
  "Flagler": { acceptanceRate: "~76% (general)", conference: "Peach Belt Conference", academics: "Private university, ~2,500 undergrads", tennisNote: "Competitive Peach Belt program", deadlineInfo: "Rolling admission, priority ~Dec 1 (general)" },
  "Rollins": { acceptanceRate: "~68% (general)", conference: "Sunshine State Conference", academics: "Private university, ~2,000 undergrads", tennisNote: "Historically strong SSC program, well-regarded academics", deadlineInfo: "ED ~Nov 1; RD ~Feb 1 (general — more selective than most D2 peers)" },
  "Florida Southern": { acceptanceRate: "~65% (general)", conference: "Sunshine State Conference", academics: "Private university, ~2,600 undergrads", tennisNote: "Perennial D2 national title contender, one of the most decorated programs in D2 tennis", deadlineInfo: "Rolling admission, priority ~Dec 1 (general)" },
  "Saint Leo": { acceptanceRate: "~72% (general)", conference: "Sunshine State Conference", academics: "Private Catholic university, ~2,300 undergrads", tennisNote: "Competitive SSC program", deadlineInfo: "Rolling admission (general)" },
  "Nova Southeastern": { acceptanceRate: "~78% (general)", conference: "Sunshine State Conference", academics: "Private university, ~6,500 undergrads", tennisNote: "Competitive SSC program", deadlineInfo: "Rolling admission (general)" },
  "Palm Beach Atlantic": { acceptanceRate: "~70% (general)", conference: "Sunshine State Conference", academics: "Private Christian university, ~2,600 undergrads", tennisNote: "Competitive SSC program", deadlineInfo: "Rolling admission (general)" },
  "Tampa": { acceptanceRate: "~60% (general)", conference: "Sunshine State Conference", academics: "Private university, ~8,000 undergrads", tennisNote: "Historically strong program, multiple national titles", deadlineInfo: "Rolling admission, priority ~Nov 1 (general)" },
  "Eckerd": { acceptanceRate: "~74% (general)", conference: "Sunshine State Conference", academics: "Private university, ~1,900 undergrads", tennisNote: "Competitive SSC program", deadlineInfo: "Rolling admission, priority ~Dec 1 (general)" },
  "West Texas A&M": { acceptanceRate: "~70% (general)", conference: "Lone Star Conference", academics: "Public university, ~7,500 undergrads", tennisNote: "Competitive LSC program", deadlineInfo: "Rolling admission (general)" },
  "Angelo State": { acceptanceRate: "~65% (general)", conference: "Lone Star Conference", academics: "Public university, ~9,000 undergrads", tennisNote: "Competitive LSC program", deadlineInfo: "Rolling admission (general)" },
  "Midwestern State": { acceptanceRate: "~85% (general)", conference: "Lone Star Conference", academics: "Public university, ~5,500 undergrads", tennisNote: "Competitive LSC program", deadlineInfo: "Rolling admission (general)" },
  "Cameron": { acceptanceRate: "~65% (general)", conference: "Lone Star Conference", academics: "Public university, ~4,000 undergrads", tennisNote: "Competitive LSC program", deadlineInfo: "Rolling admission (general)" },
  "Eastern New Mexico": { acceptanceRate: "~45% (general)", conference: "Lone Star Conference", academics: "Public university, ~3,500 undergrads", tennisNote: "Competitive LSC program", deadlineInfo: "Rolling admission (general)" },
  "Texas A&M International": { acceptanceRate: "~85% (general)", conference: "Lone Star Conference", academics: "Public university, ~7,500 undergrads", tennisNote: "Competitive LSC program", deadlineInfo: "Rolling admission (general)" },
  "St. Edward's": { acceptanceRate: "~85% (general)", conference: "Lone Star Conference", academics: "Private university, ~3,000 undergrads", tennisNote: "Competitive LSC program", deadlineInfo: "Rolling admission, priority ~Dec 1 (general)" },
  "Georgia College": { acceptanceRate: "~60% (general)", conference: "Peach Belt Conference", academics: "Public university, ~6,000 undergrads", tennisNote: "Competitive Peach Belt program", deadlineInfo: "Priority ~Feb 1, rolling after (general)" },
  "Augusta University": { acceptanceRate: "~75% (general)", conference: "Peach Belt Conference", academics: "Public university, ~7,000 undergrads", tennisNote: "Competitive Peach Belt program", deadlineInfo: "Rolling admission (general)" },
  "USC Aiken": { acceptanceRate: "~65% (general)", conference: "Peach Belt Conference", academics: "Public university, ~3,300 undergrads", tennisNote: "Competitive Peach Belt program", deadlineInfo: "Rolling admission (general)" },
  "Young Harris": { acceptanceRate: "~65% (general)", conference: "Peach Belt Conference", academics: "Private university, ~1,200 undergrads", tennisNote: "Competitive Peach Belt program", deadlineInfo: "Rolling admission (general)" },

  // D2 Wave 2
  "Catawba": { acceptanceRate: "~65% (general)", conference: "South Atlantic Conference", academics: "Private university, ~1,300 undergrads", tennisNote: "Competitive SAC program", deadlineInfo: "Rolling admission (general)" },
  "Lenoir-Rhyne": { acceptanceRate: "~65% (general)", conference: "South Atlantic Conference", academics: "Private university, ~2,000 undergrads", tennisNote: "Competitive SAC program", deadlineInfo: "Rolling admission (general)" },
  "Wingate": { acceptanceRate: "~60% (general)", conference: "South Atlantic Conference", academics: "Private university, ~2,300 undergrads", tennisNote: "Competitive SAC program", deadlineInfo: "Rolling admission (general)" },
  "Carson-Newman": { acceptanceRate: "~55% (general)", conference: "South Atlantic Conference", academics: "Private university, ~2,300 undergrads", tennisNote: "Competitive SAC program", deadlineInfo: "Rolling admission (general)" },
  "Mars Hill": { acceptanceRate: "~60% (general)", conference: "South Atlantic Conference", academics: "Private university, ~1,300 undergrads", tennisNote: "Competitive SAC program", deadlineInfo: "Rolling admission (general)" },
  "Newberry": { acceptanceRate: "~55% (general)", conference: "South Atlantic Conference", academics: "Private university, ~1,300 undergrads", tennisNote: "Competitive SAC program", deadlineInfo: "Rolling admission (general)" },
  "Anderson (SC)": { acceptanceRate: "~70% (general)", conference: "South Atlantic Conference", academics: "Private university, ~3,000 undergrads", tennisNote: "Competitive SAC program", deadlineInfo: "Rolling admission (general)" },
  "Queens University of Charlotte": { acceptanceRate: "~65% (general)", conference: "South Atlantic Conference", academics: "Private university, ~2,300 undergrads", tennisNote: "Competitive SAC program", deadlineInfo: "Rolling admission (general)" },
  "Coker": { acceptanceRate: "~55% (general)", conference: "South Atlantic Conference", academics: "Private university, ~1,400 undergrads", tennisNote: "Competitive SAC program", deadlineInfo: "Rolling admission (general)" },
  "West Chester": { acceptanceRate: "~80% (general)", conference: "Pennsylvania State Athletic Conference (PSAC)", academics: "Public university, ~13,000 undergrads", tennisNote: "Competitive PSAC program", deadlineInfo: "Priority ~Feb 1, rolling (general)" },
  "Millersville": { acceptanceRate: "~85% (general)", conference: "PSAC", academics: "Public university, ~6,000 undergrads", tennisNote: "Competitive PSAC program", deadlineInfo: "Priority ~Feb 1, rolling (general)" },
  "Kutztown": { acceptanceRate: "~90% (general)", conference: "PSAC", academics: "Public university, ~6,500 undergrads", tennisNote: "Competitive PSAC program", deadlineInfo: "Rolling admission (general)" },
  "East Stroudsburg": { acceptanceRate: "~85% (general)", conference: "PSAC", academics: "Public university, ~5,500 undergrads", tennisNote: "Competitive PSAC program", deadlineInfo: "Rolling admission (general)" },
  "Slippery Rock": { acceptanceRate: "~85% (general)", conference: "PSAC", academics: "Public university, ~7,500 undergrads", tennisNote: "Competitive PSAC program", deadlineInfo: "Rolling admission (general)" },
  "Grand Valley State": { acceptanceRate: "~85% (general)", conference: "GLIAC", academics: "Public university, ~19,000 undergrads", tennisNote: "Historically one of the strongest overall D2 athletic programs", deadlineInfo: "Priority ~Nov 1, rolling (general)" },
  "Ferris State": { acceptanceRate: "~90% (general)", conference: "GLIAC", academics: "Public university, ~9,500 undergrads", tennisNote: "Competitive GLIAC program", deadlineInfo: "Rolling admission (general)" },
  "Northwood": { acceptanceRate: "~85% (general)", conference: "GLIAC", academics: "Private university, ~1,700 undergrads", tennisNote: "Competitive GLIAC program", deadlineInfo: "Rolling admission (general)" },
  "Findlay": { acceptanceRate: "~90% (general)", conference: "GLIAC", academics: "Private university, ~3,200 undergrads", tennisNote: "Competitive GLIAC program", deadlineInfo: "Rolling admission (general)" },
  "Wayne State (MI)": { acceptanceRate: "~75% (general)", conference: "GLIAC", academics: "Public university, ~10,000 undergrads", tennisNote: "Competitive GLIAC program", deadlineInfo: "Rolling admission (general)" },
  "Rockhurst": { acceptanceRate: "~75% (general)", conference: "GLVC", academics: "Private university, ~1,900 undergrads", tennisNote: "Competitive GLVC program", deadlineInfo: "Rolling admission, priority ~Dec 1 (general)" },
  "Drury": { acceptanceRate: "~65% (general)", conference: "GLVC", academics: "Private university, ~1,600 undergrads", tennisNote: "Competitive GLVC program", deadlineInfo: "Rolling admission, priority ~Dec 1 (general)" },
  "Southern Indiana": { acceptanceRate: "~85% (general)", conference: "GLVC", academics: "Public university, ~7,000 undergrads", tennisNote: "Competitive GLVC program", deadlineInfo: "Rolling admission (general)" },
  "Truman State": { acceptanceRate: "~85% (general)", conference: "GLVC", academics: "Public university, ~4,700 undergrads \u2014 strong academics for a public D2 school", tennisNote: "Competitive GLVC program", deadlineInfo: "Priority ~Dec 1, rolling (general)" },
  "Missouri S&T": { acceptanceRate: "~75% (general)", conference: "GLVC", academics: "Public STEM-focused university, ~6,500 undergrads", tennisNote: "Competitive GLVC program", deadlineInfo: "Rolling admission, priority ~Feb 1 (general)" },
  "William Jewell": { acceptanceRate: "~65% (general)", conference: "GLVC", academics: "Private university, ~800 undergrads", tennisNote: "Competitive GLVC program", deadlineInfo: "Rolling admission (general)" },

  // D2 Wave 3 — completes D2
  "Lincoln University (MO)": { acceptanceRate: "~55% (general)", conference: "GLVC", academics: "Public HBCU, ~1,600 undergrads", tennisNote: "Competitive GLVC program", deadlineInfo: "Rolling admission (general)" },
  "Colorado Mesa": { acceptanceRate: "~90% (general)", conference: "Rocky Mountain Athletic Conference (RMAC)", academics: "Public university, ~9,000 undergrads", tennisNote: "Competitive RMAC program", deadlineInfo: "Rolling admission (general)" },
  "Colorado School of Mines": { acceptanceRate: "~45% (general)", conference: "RMAC", academics: "Public STEM-focused university, ~5,000 undergrads \u2014 strong academics", tennisNote: "Competitive RMAC program", deadlineInfo: "Priority ~Nov 1; RD ~Jan 15 (general — more selective than most D2 peers)" },
  "Western Colorado": { acceptanceRate: "~90% (general)", conference: "RMAC", academics: "Public university, ~2,700 undergrads", tennisNote: "Competitive RMAC program", deadlineInfo: "Rolling admission (general)" },
  "Regis University": { acceptanceRate: "~80% (general)", conference: "RMAC", academics: "Private university, ~2,000 undergrads", tennisNote: "Competitive RMAC program", deadlineInfo: "Rolling admission (general)" },
  "Metropolitan State (Denver)": { acceptanceRate: "~85% (general)", conference: "RMAC", academics: "Public university, ~17,000 undergrads", tennisNote: "Competitive RMAC program", deadlineInfo: "Rolling admission (general)" },
  "Colorado Christian": { acceptanceRate: "~70% (general)", conference: "RMAC", academics: "Private Christian university, ~3,000 undergrads", tennisNote: "Competitive RMAC program", deadlineInfo: "Rolling admission (general)" },
  "Virginia Union": { acceptanceRate: "~50% (general)", conference: "Central Intercollegiate Athletic Association (CIAA)", academics: "Private HBCU, ~1,500 undergrads", tennisNote: "Competitive CIAA program", deadlineInfo: "Rolling admission (general)" },
  "Virginia State": { acceptanceRate: "~85% (general)", conference: "CIAA", academics: "Public HBCU, ~3,800 undergrads", tennisNote: "Competitive CIAA program", deadlineInfo: "Rolling admission (general)" },
  "Bowie State": { acceptanceRate: "~55% (general)", conference: "CIAA", academics: "Public HBCU, ~4,500 undergrads", tennisNote: "Competitive CIAA program", deadlineInfo: "Rolling admission, priority ~Mar 1 (general)" },
  "Shippensburg": { acceptanceRate: "~85% (general)", conference: "PSAC", academics: "Public university, ~5,000 undergrads", tennisNote: "Competitive PSAC program", deadlineInfo: "Rolling admission (general)" },
  "Chico State": { acceptanceRate: "~80% (general)", conference: "California Collegiate Athletic Association (CCAA)", academics: "Public university, ~15,000 undergrads", tennisNote: "Competitive CCAA program", deadlineInfo: "RD ~Nov 30 (Cal State system, general)" },
  "Cal Poly Pomona": { acceptanceRate: "~55% (general)", conference: "CCAA", academics: "Public university, ~23,000 undergrads", tennisNote: "Competitive CCAA program", deadlineInfo: "RD ~Nov 30 (Cal State system, general)" },
  "Sonoma State": { acceptanceRate: "~85% (general)", conference: "CCAA", academics: "Public university, ~7,000 undergrads", tennisNote: "Competitive CCAA program", deadlineInfo: "RD ~Nov 30 (Cal State system, general)" },
  "Cal State San Marcos": { acceptanceRate: "~78% (general)", conference: "CCAA", academics: "Public university, ~12,000 undergrads", tennisNote: "Competitive CCAA program", deadlineInfo: "RD ~Nov 30 (Cal State system, general)" },
  "Central Missouri": { acceptanceRate: "~75% (general)", conference: "Mid-America Intercollegiate Athletics Association (MIAA)", academics: "Public university, ~10,000 undergrads", tennisNote: "Competitive MIAA program", deadlineInfo: "Rolling admission (general)" },
  "Emporia State": { acceptanceRate: "~90% (general)", conference: "MIAA", academics: "Public university, ~4,500 undergrads", tennisNote: "Competitive MIAA program", deadlineInfo: "Rolling admission (general)" },
  "Washburn": { acceptanceRate: "~90% (general)", conference: "MIAA", academics: "Public university, ~5,500 undergrads", tennisNote: "Competitive MIAA program", deadlineInfo: "Rolling admission (general)" },
  "Fort Hays State": { acceptanceRate: "~90% (general)", conference: "MIAA", academics: "Public university, ~9,000 undergrads", tennisNote: "Competitive MIAA program", deadlineInfo: "Rolling admission (general)" },
  "Delta State": { acceptanceRate: "~65% (general)", conference: "Gulf South Conference", academics: "Public university, ~2,500 undergrads", tennisNote: "Competitive Gulf South program", deadlineInfo: "Rolling admission (general)" },
  "Mississippi College": { acceptanceRate: "~70% (general)", conference: "Gulf South Conference", academics: "Private university, ~2,000 undergrads", tennisNote: "Competitive Gulf South program", deadlineInfo: "Rolling admission, priority ~Dec 1 (general)" },
  "Christian Brothers": { acceptanceRate: "~65% (general)", conference: "Gulf South Conference", academics: "Private university, ~1,300 undergrads", tennisNote: "Competitive Gulf South program", deadlineInfo: "Rolling admission (general)" },
  "Union University": { acceptanceRate: "~70% (general)", conference: "Gulf South Conference", academics: "Private university, ~2,300 undergrads", tennisNote: "Competitive Gulf South program", deadlineInfo: "Rolling admission, priority ~Dec 1 (general)" },

  // D3 Wave 1
  "Emory": { acceptanceRate: "~11% (general)", conference: "UAA", academics: "Private research university, ~7,000 undergrads", tennisNote: "One of the most decorated programs in D3 tennis history, multiple NCAA titles", deadlineInfo: "ED I ~Nov 1; ED II ~Jan 1; RD ~Jan 1 (general)" },
  "Williams": { acceptanceRate: "~7% (verified, Class of 2030 estimate)", conference: "NESCAC", academics: "Private liberal arts college, ~2,000 undergrads", tennisNote: "Highly competitive NESCAC program", deadlineInfo: "ED ~Nov 15; RD ~Jan 5 (verified pattern, 2026-27 cycle)" },
  "Amherst": { acceptanceRate: "~7% (verified, Class of 2030)", conference: "NESCAC", academics: "Private liberal arts college, ~1,900 undergrads", tennisNote: "Highly competitive NESCAC program", deadlineInfo: "ED ~Nov 1; RD ~Jan 1 (verified pattern, 2026-27 cycle)" },
  "Middlebury": { acceptanceRate: "~17% (verified, Class of 2030)", conference: "NESCAC", academics: "Private liberal arts college, ~2,800 undergrads", tennisNote: "Highly competitive NESCAC program", deadlineInfo: "ED I ~Nov 1; ED II ~Jan 1; RD ~Jan 1 (general)" },
  "Washington and Lee": { acceptanceRate: "~16% (general)", conference: "Old Dominion Athletic Conference (ODAC)", academics: "Private university, ~1,900 undergrads", tennisNote: "Competitive ODAC program", deadlineInfo: "ED I ~Nov 1; ED II ~Jan 1; RD ~Jan 1 (general)" },
  "Kenyon": { acceptanceRate: "~28% (general)", conference: "North Coast Athletic Conference (NCAC)", academics: "Private liberal arts college, ~1,800 undergrads", tennisNote: "Competitive NCAC program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 15; RD ~Jan 15 (general)" },
  "Denison": { acceptanceRate: "~20% (general)", conference: "NCAC", academics: "Private liberal arts college, ~2,300 undergrads", tennisNote: "Competitive NCAC program", deadlineInfo: "ED I ~Nov 1; ED II ~Jan 15; RD ~Feb 1 (general)" },
  "University of Chicago": { acceptanceRate: "~5% (general)", conference: "UAA", academics: "Private research university, ~7,000 undergrads", tennisNote: "Competitive UAA program", deadlineInfo: "ED I ~Nov 3; ED II/RD ~Jan 5 (verified pattern, 2026-27 cycle)" },
  "Carnegie Mellon": { acceptanceRate: "~11% (general)", conference: "UAA", academics: "Private research university, ~7,000 undergrads \u2014 strong STEM focus", tennisNote: "Competitive UAA program", deadlineInfo: "ED ~Nov 2; RD ~Jan 3 (verified pattern, 2026-27 cycle)" },
  "Case Western Reserve": { acceptanceRate: "~30% (general)", conference: "UAA", academics: "Private research university, ~6,000 undergrads", tennisNote: "Competitive UAA program", deadlineInfo: "ED I ~Nov 1; ED II ~Jan 15; RD ~Jan 15 (general)" },
  "Claremont-Mudd-Scripps": { acceptanceRate: "Consortium \u2014 Claremont McKenna ~10%, Harvey Mudd ~10%, Scripps ~30% (three separate admissions processes)", conference: "SCIAC", academics: "Private liberal arts consortium sharing one athletic program", tennisNote: "One of the most decorated programs in NCAA D3 tennis, multiple national titles", deadlineInfo: "Consortium — CMC & Mudd ED ~Nov 1, RD ~Jan 1; Scripps ED ~Nov 15, RD ~Jan 10 (general, verify per school)" },
  "Pomona-Pitzer": { acceptanceRate: "Consortium \u2014 Pomona ~7%, Pitzer ~40% (separate admissions processes)", conference: "SCIAC", academics: "Private liberal arts consortium sharing one athletic program", tennisNote: "Historically one of the top D3 programs nationally", deadlineInfo: "Consortium — Pomona ED ~Nov 1, RD ~Jan 5; Pitzer ED ~Nov 1, RD ~Jan 15 (general)" },
  "Trinity (TX)": { acceptanceRate: "~30% (general)", conference: "Southern Collegiate Athletic Conference (SCAC)", academics: "Private university, ~2,600 undergrads", tennisNote: "Historically strong program, multiple national titles", deadlineInfo: "ED ~Nov 1; RD ~Feb 1 (general)" },
  "Johns Hopkins": { acceptanceRate: "~7% (general)", conference: "Centennial Conference", academics: "Private research university, ~6,500 undergrads", tennisNote: "Competitive Centennial program", deadlineInfo: "ED I ~Nov 1; ED II/RD ~Jan 2 (verified pattern, 2026-27 cycle)" },
  "MIT": { acceptanceRate: "~4.6% (verified, Class of 2030)", conference: "NEWMAC", academics: "Private research university, ~4,600 undergrads", tennisNote: "Competitive NEWMAC program", deadlineInfo: "EA ~Nov 1; RD ~Jan 1 (verified pattern, 2026-27 cycle)" },
  "NYU": { acceptanceRate: "~8% (general)", conference: "UAA", academics: "Private research university, large for a D3 school at ~29,000 undergrads", tennisNote: "Competitive UAA program", deadlineInfo: "ED I ~Nov 1; ED II ~Jan 1; RD ~Jan 5 (general)" },
  "Bowdoin": { acceptanceRate: "~8% (general)", conference: "NESCAC", academics: "Private liberal arts college, ~1,900 undergrads", tennisNote: "Highly competitive NESCAC program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 1; RD ~Jan 1 (general)" },
  "Wesleyan": { acceptanceRate: "~14% (general)", conference: "NESCAC", academics: "Private university, ~3,000 undergrads", tennisNote: "Competitive NESCAC program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 1; RD ~Jan 1 (general)" },
  "Tufts": { acceptanceRate: "~9% (general)", conference: "NESCAC", academics: "Private research university, ~6,500 undergrads", tennisNote: "Highly competitive NESCAC program", deadlineInfo: "ED I ~Nov 1; ED II ~Jan 4; RD ~Jan 4 (general)" },
  "Bates": { acceptanceRate: "~13% (general)", conference: "NESCAC", academics: "Private liberal arts college, ~1,900 undergrads", tennisNote: "Competitive NESCAC program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 1; RD ~Jan 15 (general)" },
  "Colby": { acceptanceRate: "~8% (general)", conference: "NESCAC", academics: "Private liberal arts college, ~2,200 undergrads", tennisNote: "Competitive NESCAC program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 1; RD ~Jan 15 (general)" },
  "Hamilton": { acceptanceRate: "~12% (general)", conference: "NESCAC", academics: "Private liberal arts college, ~2,000 undergrads", tennisNote: "Competitive NESCAC program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 1; RD ~Jan 1 (general)" },
  "Skidmore": { acceptanceRate: "~22% (general)", conference: "Liberty League", academics: "Private liberal arts college, ~2,900 undergrads", tennisNote: "Competitive Liberty League program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 1; RD ~Jan 15 (general)" },
  "Swarthmore": { acceptanceRate: "~7% (verified, Class of 2030 estimate)", conference: "Centennial Conference", academics: "Private liberal arts college, ~1,700 undergrads", tennisNote: "Highly competitive Centennial program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 3; RD ~Jan 3 (general)" },
  "Haverford": { acceptanceRate: "~15% (general)", conference: "Centennial Conference", academics: "Private liberal arts college, ~1,400 undergrads", tennisNote: "Competitive Centennial program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 15; RD ~Jan 15 (general)" },

  // D3 Wave 2
  "Gustavus Adolphus": { acceptanceRate: "~65% (general)", conference: "MIAC", academics: "Private liberal arts college, ~2,200 undergrads", tennisNote: "Competitive MIAC program", deadlineInfo: "Priority ~Dec 1, rolling (general)" },
  "DePauw": { acceptanceRate: "~65% (general)", conference: "NCAC", academics: "Private liberal arts college, ~1,700 undergrads", tennisNote: "Competitive NCAC program", deadlineInfo: "Rolling admission, priority ~Nov 1 (general)" },
  "Rochester": { acceptanceRate: "~40% (general)", conference: "UAA", academics: "Private research university, ~7,000 undergrads", tennisNote: "Competitive UAA program", deadlineInfo: "ED I ~Nov 1; ED II ~Jan 1; RD ~Jan 5 (general)" },
  "Trinity College (CT)": { acceptanceRate: "~30% (general)", conference: "NESCAC", academics: "Private liberal arts college, ~2,200 undergrads", tennisNote: "Competitive NESCAC program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 1; RD ~Jan 1 (general)" },
  "Connecticut College": { acceptanceRate: "~35% (general)", conference: "NESCAC", academics: "Private liberal arts college, ~1,900 undergrads", tennisNote: "Competitive NESCAC program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 1; RD ~Jan 1 (general)" },
  "Washington University in St. Louis": { acceptanceRate: "~12% (general)", conference: "UAA", academics: "Private research university, ~7,500 undergrads", tennisNote: "Highly competitive UAA program", deadlineInfo: "ED I ~Nov 1; ED II ~Jan 2; RD ~Jan 2 (general)" },
  "Brandeis": { acceptanceRate: "~35% (general)", conference: "UAA", academics: "Private research university, ~3,600 undergrads", tennisNote: "Competitive UAA program", deadlineInfo: "ED I ~Nov 1; ED II ~Jan 1; RD ~Jan 15 (general)" },
  "Macalester": { acceptanceRate: "~28% (general)", conference: "MIAC", academics: "Private liberal arts college, ~2,100 undergrads", tennisNote: "Competitive MIAC program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 15; RD ~Jan 15 (general)" },
  "St. Olaf": { acceptanceRate: "~55% (general)", conference: "MIAC", academics: "Private liberal arts college, ~3,000 undergrads", tennisNote: "Competitive MIAC program", deadlineInfo: "Priority ~Dec 1, rolling (general)" },
  "Carleton": { acceptanceRate: "~18% (general)", conference: "MIAC", academics: "Private liberal arts college, ~2,100 undergrads", tennisNote: "Competitive MIAC program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 15; RD ~Jan 15 (general)" },
  "Augsburg": { acceptanceRate: "~70% (general)", conference: "MIAC", academics: "Private university, ~2,300 undergrads", tennisNote: "Competitive MIAC program", deadlineInfo: "Rolling admission (general)" },
  "Hamline": { acceptanceRate: "~75% (general)", conference: "MIAC", academics: "Private university, ~1,700 undergrads", tennisNote: "Competitive MIAC program", deadlineInfo: "Rolling admission (general)" },
  "Bethel (MN)": { acceptanceRate: "~80% (general)", conference: "MIAC", academics: "Private university, ~2,700 undergrads", tennisNote: "Competitive MIAC program", deadlineInfo: "Rolling admission (general)" },
  "Concordia (MN)": { acceptanceRate: "~65% (general)", conference: "MIAC", academics: "Private university, ~2,000 undergrads", tennisNote: "Competitive MIAC program", deadlineInfo: "Rolling admission (general)" },
  "St. Mary's (MN)": { acceptanceRate: "~75% (general)", conference: "MIAC", academics: "Private university, ~1,300 undergrads", tennisNote: "Competitive MIAC program", deadlineInfo: "Rolling admission (general)" },
  "St. John's (MN)": { acceptanceRate: "~70% (general)", conference: "MIAC", academics: "Private men's college, ~1,500 undergrads \u2014 coordinate campus with St. Benedict", tennisNote: "Competitive MIAC program", deadlineInfo: "Priority ~Dec 1, rolling (general)" },
  "St. Benedict": { acceptanceRate: "~70% (general)", conference: "MIAC", academics: "Private women's college, ~1,500 undergrads \u2014 coordinate campus with St. John's", tennisNote: "Competitive MIAC program", deadlineInfo: "Priority ~Dec 1, rolling (general)" },
  "Franklin & Marshall": { acceptanceRate: "~35% (general)", conference: "Centennial Conference", academics: "Private liberal arts college, ~2,300 undergrads", tennisNote: "Competitive Centennial program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 15; RD ~Jan 15 (general)" },
  "Dickinson": { acceptanceRate: "~45% (general)", conference: "Centennial Conference", academics: "Private liberal arts college, ~2,200 undergrads", tennisNote: "Competitive Centennial program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 15; RD ~Feb 1 (general)" },
  "Gettysburg": { acceptanceRate: "~45% (general)", conference: "Centennial Conference", academics: "Private liberal arts college, ~2,300 undergrads", tennisNote: "Competitive Centennial program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 15; RD ~Jan 15 (general)" },
  "Muhlenberg": { acceptanceRate: "~40% (general)", conference: "Centennial Conference", academics: "Private liberal arts college, ~2,200 undergrads", tennisNote: "Competitive Centennial program", deadlineInfo: "Rolling, priority ~Feb 1 (general)" },
  "McDaniel": { acceptanceRate: "~65% (general)", conference: "Centennial Conference", academics: "Private liberal arts college, ~1,600 undergrads", tennisNote: "Competitive Centennial program", deadlineInfo: "Rolling admission (general)" },
  "Ursinus": { acceptanceRate: "~65% (general)", conference: "Centennial Conference", academics: "Private liberal arts college, ~1,600 undergrads", tennisNote: "Competitive Centennial program", deadlineInfo: "Rolling admission, priority ~Feb 1 (general)" },
  "Occidental": { acceptanceRate: "~35% (general)", conference: "SCIAC", academics: "Private liberal arts college, ~2,000 undergrads", tennisNote: "Competitive SCIAC program", deadlineInfo: "ED I ~Nov 1; ED II ~Jan 1; RD ~Jan 10 (general)" },
  "Redlands": { acceptanceRate: "~65% (general)", conference: "SCIAC", academics: "Private university, ~2,300 undergrads", tennisNote: "Competitive SCIAC program", deadlineInfo: "Rolling admission, priority ~Jan 15 (general)" },

  // D3 Wave 3 — completes D3
  "Whittier": { acceptanceRate: "~75% (general)", conference: "SCIAC", academics: "Private university, ~1,400 undergrads", tennisNote: "Competitive SCIAC program", deadlineInfo: "Rolling admission (general)" },
  "La Verne": { acceptanceRate: "~70% (general)", conference: "SCIAC", academics: "Private university, ~2,000 undergrads", tennisNote: "Competitive SCIAC program", deadlineInfo: "Rolling admission (general)" },
  "Chapman": { acceptanceRate: "~50% (general)", conference: "SCIAC", academics: "Private university, ~7,500 undergrads", tennisNote: "Competitive SCIAC program", deadlineInfo: "ED I ~Nov 1; ED II ~Jan 10; RD ~Jan 10 (general)" },
  "Wooster": { acceptanceRate: "~55% (general)", conference: "NCAC", academics: "Private liberal arts college, ~2,000 undergrads", tennisNote: "Competitive NCAC program", deadlineInfo: "ED ~Nov 15; RD ~Jan 15, rolling after (general)" },
  "Wittenberg": { acceptanceRate: "~65% (general)", conference: "NCAC", academics: "Private liberal arts college, ~1,600 undergrads", tennisNote: "Competitive NCAC program", deadlineInfo: "Rolling admission (general)" },
  "Oberlin": { acceptanceRate: "~35% (general)", conference: "NCAC", academics: "Private liberal arts college, ~2,900 undergrads", tennisNote: "Competitive NCAC program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 5; RD ~Jan 15 (general)" },
  "Wabash": { acceptanceRate: "~60% (general)", conference: "NCAC", academics: "Private men's liberal arts college, ~800 undergrads", tennisNote: "Competitive NCAC program", deadlineInfo: "Rolling admission (general)" },
  "Ohio Wesleyan": { acceptanceRate: "~65% (general)", conference: "NCAC", academics: "Private liberal arts college, ~1,400 undergrads", tennisNote: "Competitive NCAC program", deadlineInfo: "Rolling admission (general)" },
  "Allegheny": { acceptanceRate: "~65% (general)", conference: "NCAC", academics: "Private liberal arts college, ~1,600 undergrads", tennisNote: "Competitive NCAC program", deadlineInfo: "Rolling admission, priority ~Feb 1 (general)" },
  "Hobart and William Smith": { acceptanceRate: "~65% (general)", conference: "Liberty League", academics: "Private coordinate liberal arts colleges, ~2,000 undergrads", tennisNote: "Competitive Liberty League program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 15; RD ~Feb 1 (general)" },
  "RPI": { acceptanceRate: "~50% (general)", conference: "Liberty League", academics: "Private STEM-focused research university, ~7,000 undergrads", tennisNote: "Competitive Liberty League program", deadlineInfo: "ED ~Nov 15; RD ~Jan 15 (general)" },
  "Union (NY)": { acceptanceRate: "~45% (general)", conference: "Liberty League", academics: "Private liberal arts college, ~2,200 undergrads", tennisNote: "Competitive Liberty League program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 15; RD ~Feb 1 (general)" },
  "Vassar": { acceptanceRate: "~20% (general)", conference: "Liberty League", academics: "Private liberal arts college, ~2,500 undergrads", tennisNote: "Competitive Liberty League program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 1; RD ~Jan 1 (general)" },
  "Bard": { acceptanceRate: "~65% (general)", conference: "Liberty League", academics: "Private liberal arts college, ~2,000 undergrads", tennisNote: "Competitive Liberty League program", deadlineInfo: "Rolling, priority ~Jan 15 (general)" },
  "Clarkson": { acceptanceRate: "~65% (general)", conference: "Liberty League", academics: "Private STEM-focused university, ~4,300 undergrads", tennisNote: "Competitive Liberty League program", deadlineInfo: "Rolling admission, priority ~Feb 1 (general)" },
  "St. Lawrence": { acceptanceRate: "~55% (general)", conference: "Liberty League", academics: "Private liberal arts college, ~2,400 undergrads", tennisNote: "Competitive Liberty League program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 15; RD ~Feb 15 (general)" },
  "Roanoke": { acceptanceRate: "~75% (general)", conference: "ODAC", academics: "Private university, ~1,900 undergrads", tennisNote: "Competitive ODAC program", deadlineInfo: "Rolling admission (general)" },
  "Randolph-Macon": { acceptanceRate: "~75% (general)", conference: "ODAC", academics: "Private university, ~1,500 undergrads", tennisNote: "Competitive ODAC program", deadlineInfo: "Rolling admission (general)" },
  "Virginia Wesleyan": { acceptanceRate: "~70% (general)", conference: "ODAC", academics: "Private university, ~1,300 undergrads", tennisNote: "Competitive ODAC program", deadlineInfo: "Rolling admission (general)" },
  "Juniata": { acceptanceRate: "~55% (general)", conference: "Landmark Conference", academics: "Private liberal arts college, ~1,300 undergrads", tennisNote: "Competitive Landmark program", deadlineInfo: "Rolling admission, priority ~Feb 15 (general)" },
  "Susquehanna": { acceptanceRate: "~70% (general)", conference: "Landmark Conference", academics: "Private university, ~2,200 undergrads", tennisNote: "Competitive Landmark program", deadlineInfo: "Rolling admission (general)" },
  "Elizabethtown": { acceptanceRate: "~70% (general)", conference: "Landmark Conference", academics: "Private university, ~1,500 undergrads", tennisNote: "Competitive Landmark program", deadlineInfo: "Rolling admission (general)" },
  "Moravian": { acceptanceRate: "~75% (general)", conference: "Landmark Conference", academics: "Private university, ~1,700 undergrads", tennisNote: "Competitive Landmark program", deadlineInfo: "Rolling admission (general)" },
  "Southwestern": { acceptanceRate: "~55% (general)", conference: "SCAC", academics: "Private university, ~1,500 undergrads", tennisNote: "Competitive SCAC program", deadlineInfo: "Rolling admission, priority ~Feb 1 (general)" },
  "Centre": { acceptanceRate: "~55% (general)", conference: "Southern Athletic Association (SAA)", academics: "Private liberal arts college, ~1,400 undergrads", tennisNote: "Competitive SAA program", deadlineInfo: "ED ~Nov 1; RD ~Feb 1, rolling (general)" },
  "Rhodes": { acceptanceRate: "~45% (general)", conference: "SAA", academics: "Private liberal arts college, ~2,000 undergrads", tennisNote: "Competitive SAA program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 15; RD ~Feb 1 (general)" },
  "Sewanee": { acceptanceRate: "~65% (general)", conference: "SAA", academics: "Private liberal arts university, ~1,800 undergrads", tennisNote: "Competitive SAA program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 15; RD ~Feb 15 (general)" },
  "Whitman": { acceptanceRate: "~50% (general)", conference: "Northwest Conference", academics: "Private liberal arts college, ~1,500 undergrads", tennisNote: "Competitive Northwest Conference program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 5; RD ~Jan 15 (general)" },
  "Willamette": { acceptanceRate: "~70% (general)", conference: "Northwest Conference", academics: "Private university, ~1,800 undergrads", tennisNote: "Competitive Northwest Conference program", deadlineInfo: "Rolling admission, priority ~Feb 1 (general)" },
  "Lewis & Clark": { acceptanceRate: "~70% (general)", conference: "Northwest Conference", academics: "Private liberal arts college, ~1,900 undergrads", tennisNote: "Competitive Northwest Conference program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 15; RD ~Jan 15 (general)" },
  "Puget Sound": { acceptanceRate: "~85% (general)", conference: "Northwest Conference", academics: "Private liberal arts college, ~2,000 undergrads", tennisNote: "Competitive Northwest Conference program", deadlineInfo: "Rolling admission, priority ~Feb 1 (general)" },
  "George Fox": { acceptanceRate: "~90% (general)", conference: "Northwest Conference", academics: "Private Christian university, ~3,500 undergrads", tennisNote: "Competitive Northwest Conference program", deadlineInfo: "Rolling admission (general)" },
  "Linfield": { acceptanceRate: "~85% (general)", conference: "Northwest Conference", academics: "Private university, ~1,400 undergrads", tennisNote: "Competitive Northwest Conference program", deadlineInfo: "Rolling admission (general)" },
  "Pacific Lutheran": { acceptanceRate: "~85% (general)", conference: "Northwest Conference", academics: "Private university, ~2,700 undergrads", tennisNote: "Competitive Northwest Conference program", deadlineInfo: "Rolling admission (general)" },
  "Colorado College": { acceptanceRate: "~12% (general)", conference: "SCAC", academics: "Private liberal arts college, ~2,100 undergrads", tennisNote: "Competitive SCAC program", deadlineInfo: "ED I ~Nov 15; ED II ~Jan 15; RD ~Jan 15 (general)" },
  "Lindenwood": { acceptanceRate: "~85% (general)", conference: "Conference USA", academics: "Public university, ~11,000 undergrads", tennisNote: "Reclassified from NAIA to D1 in the early 2020s", deadlineInfo: "Rolling admission (general)" },

  // NAIA — completes the directory
  "Georgia Gwinnett": { acceptanceRate: "Open admission \u2014 near 100% (general, access-focused public institution)", conference: "NAIA \u2014 The Sun Conference", academics: "Public university, ~10,000 undergrads", tennisNote: "Competitive NAIA program", deadlineInfo: "Rolling, open admission (general)" },
  "Union (TN)": { acceptanceRate: "~55% (general)", conference: "NAIA \u2014 Mid-South Conference", academics: "Private university, ~2,700 undergrads", tennisNote: "Competitive NAIA program", deadlineInfo: "Rolling admission (general)" },
  "Cumberlands": { acceptanceRate: "~50% (general)", conference: "NAIA \u2014 Mid-South Conference", academics: "Private university, ~4,000 undergrads on-campus", tennisNote: "Competitive NAIA program", deadlineInfo: "Rolling admission (general)" },
  "Oklahoma City": { acceptanceRate: "~65% (general)", conference: "NAIA \u2014 Sooner Athletic Conference", academics: "Private university, ~2,000 undergrads", tennisNote: "Competitive NAIA program", deadlineInfo: "Rolling admission (general)" },
  "Southeastern": { acceptanceRate: "~55% (general)", conference: "NAIA \u2014 The Sun Conference", academics: "Private Christian university, ~5,500 undergrads", tennisNote: "Competitive NAIA program", deadlineInfo: "Rolling admission (general)" },
  "Life": { acceptanceRate: "~60% (general)", conference: "NAIA \u2014 Southern States Athletic Conference", academics: "Private university, ~3,000 undergrads", tennisNote: "Competitive NAIA program", deadlineInfo: "Rolling admission (general)" },
  "Keiser": { acceptanceRate: "~50% (general)", conference: "NAIA \u2014 The Sun Conference", academics: "Private university, ~20,000 undergrads across campuses", tennisNote: "Competitive NAIA program", deadlineInfo: "Rolling admission (general)" },
};

const uid = () => Math.random().toString(36).slice(2, 10);
const todayStr = () => new Date().toISOString().slice(0, 10);
const fmtDate = (d) => {
  if (!d) return "\u2014";
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
const fmtDateLong = (d) => {
  if (!d) return "recently";
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en-US", { month: "long", day: "numeric" });
};

const emptyDraft = () => ({
  id: null,
  school: "",
  division: "D3",
  coachName: "",
  coachEmail: "",
  stage: 0,
  lastContact: todayStr(),
  nextFollowUp: "",
  notes: "",
  acceptanceRate: "",
  programInfo: "",
  conference: "",
  academics: "",
  tennisNote: "",
  applicationPlan: "",
  applicationDeadline: "",
  deadlineNote: "",
});

const APPLICATION_PLANS = ["ED", "ED II", "EA", "REA", "RD", "Rolling"];

const emptyProfile = () => ({ name: "", gradYear: "", utr: "", targetDivision: "" });

function buildInitialEmail(profile, s) {
  const name = profile.name || "[your name]";
  const grad = profile.gradYear ? `, class of ${profile.gradYear}` : "";
  const utrLine = profile.utr ? `My current UTR is ${profile.utr}. ` : "";
  const coach = s.coachName ? `Coach ${s.coachName.split(" ").slice(-1)[0]}` : "Coach";
  return `Subject: Introduction \u2013 ${name}${grad}\n\nDear ${coach},\n\nMy name is ${name}${grad}, and I'm reaching out because I'm very interested in ${s.school}'s tennis program. ${utrLine}I wanted to introduce myself and learn more about what you look for in recruits and whether there might be a fit.\n\nI'd welcome the chance to speak whenever you have a few minutes. Thank you for your time and consideration.\n\nBest,\n${name}`;
}

function buildFollowUpEmail(profile, s) {
  const name = profile.name || "[your name]";
  const coach = s.coachName ? `Coach ${s.coachName.split(" ").slice(-1)[0]}` : "Coach";
  const when = fmtDateLong(s.lastContact);
  return `Subject: Following up \u2013 ${name}\n\nHi ${coach},\n\nI wanted to briefly follow up on my note from ${when} introducing myself and my interest in ${s.school}'s tennis program. I know recruiting season keeps you busy, but wanted to reiterate my interest and see if there's a good time to connect.\n\nThanks again for your time.\n\nBest,\n${name}`;
}

export default function RecruitingBoard() {
  const [schools, setSchools] = useState(null);
  const [profile, setProfile] = useState(emptyProfile());
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState(false);
  const [query, setQuery] = useState("");
  const [divFilter, setDivFilter] = useState("All");
  const [fitFilter, setFitFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState(emptyDraft());
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [schoolSuggestOpen, setSchoolSuggestOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [templateFor, setTemplateFor] = useState(null);
  const [templateTab, setTemplateTab] = useState("initial");
  const [copied, setCopied] = useState(false);
  const suggestRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await storage.get("schools");
        setSchools(res ? JSON.parse(res.value) : []);
      } catch (e) {
        setSchools([]);
      }
      try {
        const p = await storage.get("profile");
        if (p) setProfile(JSON.parse(p.value));
      } catch (e) {
        // no profile saved yet
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target)) {
        setSchoolSuggestOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const persist = async (next) => {
    setSchools(next);
    try {
      const res = await storage.set("schools", JSON.stringify(next));
      setSaveError(!res);
    } catch (e) {
      setSaveError(true);
    }
  };

  const saveProfile = async (next) => {
    setProfile(next);
    try {
      await storage.set("profile", JSON.stringify(next));
    } catch (e) {
      setSaveError(true);
    }
  };

  const openAdd = () => {
    setDraft(emptyDraft());
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setDraft({ ...s });
    setModalOpen(true);
  };

  const saveDraft = () => {
    if (!draft.school.trim()) return;
    let next;
    if (draft.id) {
      next = schools.map((s) => (s.id === draft.id ? draft : s));
    } else {
      next = [...schools, { ...draft, id: uid() }];
    }
    persist(next);
    setModalOpen(false);
  };

  const removeSchool = (id) => {
    persist(schools.filter((s) => s.id !== id));
    setConfirmDelete(null);
  };

  const setStage = (s, stageIdx) => {
    persist(schools.map((x) => (x.id === s.id ? { ...x, stage: stageIdx } : x)));
  };

  const schoolMatches = useMemo(() => {
    const q = draft.school.trim().toLowerCase();
    if (!q) return [];
    const target = profile.targetDivision;
    return COLLEGES.filter(([name, division]) => {
      const nameOk = name.toLowerCase().includes(q);
      const divOk = !target || target === "All" || division === target;
      return nameOk && divOk;
    }).slice(0, 6);
  }, [draft.school, profile.targetDivision]);

  const pickSuggestion = (name, division) => {
    const info = SCHOOL_INFO[name];
    setDraft({
      ...draft,
      school: name,
      division,
      acceptanceRate: info ? info.acceptanceRate : "",
      conference: info ? info.conference : "",
      academics: info ? info.academics : "",
      tennisNote: info ? info.tennisNote : "",
      deadlineNote: info && info.deadlineInfo ? info.deadlineInfo : "",
    });
    setSchoolSuggestOpen(false);
  };

  const filtered = useMemo(() => {
    if (!schools) return [];
    const q = query.trim().toLowerCase();
    return schools
      .filter((s) => divFilter === "All" || s.division === divFilter)
      .filter((s) => {
        if (fitFilter === "All") return true;
        const cls = classifyDivision(profile.utr, s.division, s.school);
        return cls === fitFilter.toLowerCase();
      })
      .filter(
        (s) =>
          !q ||
          s.school.toLowerCase().includes(q) ||
          s.coachName.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const aOver = a.nextFollowUp && a.nextFollowUp < todayStr() ? 0 : 1;
        const bOver = b.nextFollowUp && b.nextFollowUp < todayStr() ? 0 : 1;
        if (aOver !== bOver) return aOver - bOver;
        if (!a.nextFollowUp) return 1;
        if (!b.nextFollowUp) return -1;
        return a.nextFollowUp.localeCompare(b.nextFollowUp);
      });
  }, [schools, query, divFilter, fitFilter, profile.utr]);

  const columns = useMemo(() => {
    const cols = STAGES.map((label, i) => ({ label, index: i, items: [] }));
    filtered.forEach((s) => {
      cols[s.stage].items.push(s);
    });
    return cols;
  }, [filtered]);

  const stats = useMemo(() => {
    if (!schools) return { total: 0, replied: 0, overdue: 0, deadlinesSoon: 0 };
    const today = todayStr();
    return {
      total: schools.length,
      replied: schools.filter((s) => s.stage >= 2).length,
      overdue: schools.filter((s) => s.nextFollowUp && s.nextFollowUp < today).length,
      deadlinesSoon: schools.filter((s) => {
        if (!s.applicationDeadline) return false;
        const diff = new Date(s.applicationDeadline + "T00:00:00") - new Date(today + "T00:00:00");
        return diff >= 0 && diff <= 14 * 24 * 60 * 60 * 1000;
      }).length,
    };
  }, [schools]);

  const openTemplate = (s, tab) => {
    setTemplateFor(s);
    setTemplateTab(tab);
    setCopied(false);
  };

  const templateText = templateFor
    ? templateTab === "initial"
      ? buildInitialEmail(profile, templateFor)
      : buildFollowUpEmail(profile, templateFor)
    : "";

  const copyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(templateText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // clipboard blocked; text remains selectable in the box
    }
  };

  const renderCard = (s) => {
    const overdue = s.nextFollowUp && s.nextFollowUp < todayStr();
    const cls = classifyDivision(profile.utr, s.division, s.school);
    const clsStyle = cls ? CLASS_STYLE[cls] : null;
    const deadlinePassed = s.applicationDeadline && s.applicationDeadline < todayStr();
    const deadlineSoon =
      s.applicationDeadline &&
      !deadlinePassed &&
      new Date(s.applicationDeadline + "T00:00:00") - new Date(todayStr() + "T00:00:00") <= 14 * 24 * 60 * 60 * 1000;
    return (
      <div key={s.id} style={styles.card}>
        <div style={styles.cardTop}>
          <div>
            <div style={styles.schoolName}>{s.school}</div>
            <div
              style={{
                ...styles.divBadge,
                ...(clsStyle ? { background: clsStyle.bg, color: clsStyle.text } : {}),
              }}
            >
              {s.division}
              {clsStyle ? ` \u00b7 ${clsStyle.label}` : ""}
            </div>
          </div>
          <div style={styles.cardActions}>
            <button style={styles.iconBtn} onClick={() => openEdit(s)} aria-label="Edit">
              <Pencil size={14} />
            </button>
            <button style={styles.iconBtn} onClick={() => setConfirmDelete(s.id)} aria-label="Delete">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div style={styles.dotsRow}>
          {STAGES.map((label, i) => (
            <div key={label} style={styles.dotWrap} title={label}>
              <div
                className={`rb-dot ${i < s.stage ? "filled" : ""} ${i === s.stage ? "current" : ""}`}
                onClick={() => setStage(s, i)}
              />
            </div>
          ))}
        </div>

        <div style={styles.metaRow}>
          <span style={styles.metaItem}>{s.coachName || "No coach name"}</span>
          {s.coachEmail && <span style={styles.metaItem}>{s.coachEmail}</span>}
          {s.acceptanceRate && <span style={styles.metaItem}>Acceptance: {s.acceptanceRate}</span>}
          {s.conference && <span style={styles.metaItem}>{s.conference}</span>}
        </div>

        {s.academics && <div style={styles.academicsLine}>{s.academics}</div>}
        {s.tennisNote && <div style={styles.tennisLine}>{s.tennisNote}</div>}
        {s.programInfo && <div style={styles.programInfo}>{s.programInfo}</div>}

        <div style={styles.dateRow}>
          <span style={styles.dateItem}>
            Last contact <span style={styles.dateMono}>{fmtDate(s.lastContact)}</span>
          </span>
          <span style={{ ...styles.dateItem, ...(overdue ? styles.overdue : {}) }}>
            Next follow-up <span style={styles.dateMono}>{s.nextFollowUp ? fmtDate(s.nextFollowUp) : "\u2014"}</span>
            {overdue && " \u2014 overdue"}
          </span>
        </div>

        {s.applicationDeadline && (
          <div style={styles.deadlineRow}>
            <span
              style={{
                ...styles.deadlineChip,
                ...(deadlinePassed ? styles.deadlinePassed : deadlineSoon ? styles.deadlineSoon : styles.deadlineNormal),
              }}
            >
              {s.applicationPlan ? `${s.applicationPlan} deadline` : "Deadline"}: {fmtDate(s.applicationDeadline)}
              {deadlinePassed ? " \u2014 passed" : deadlineSoon ? " \u2014 coming up" : ""}
            </span>
          </div>
        )}

        {s.notes && <div style={styles.notes}>{s.notes}</div>}


        <div style={styles.templateRow}>
          <button style={styles.templateBtn} onClick={() => openTemplate(s, "initial")}>
            <Mail size={13} /> Initial email
          </button>
          <button style={styles.templateBtn} onClick={() => openTemplate(s, "followup")}>
            <Mail size={13} /> Follow-up email
          </button>
          {overdue && <span style={styles.suggestChip}>Follow up</span>}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .rb-input, .rb-select, .rb-textarea {
          font-family: 'IBM Plex Sans', sans-serif;
          border: 1px solid #C9CFC3;
          border-radius: 6px;
          padding: 8px 10px;
          font-size: 14px;
          color: #131C17;
          background: #FFFFFF;
          width: 100%;
          outline: none;
        }
        .rb-input:focus, .rb-select:focus, .rb-textarea:focus {
          border-color: #14413D;
          box-shadow: 0 0 0 2px rgba(20,65,61,0.12);
        }
        .rb-dot {
          width: 13px; height: 13px; border-radius: 50%;
          border: 1.5px solid #C9CFC3;
          background: #F4F2EA;
          cursor: pointer;
          transition: transform 0.1s ease;
        }
        .rb-dot:hover { transform: scale(1.15); }
        .rb-dot.filled { background: #14413D; border-color: #14413D; }
        .rb-dot.current { background: #D7E552; border-color: #A9B930; }
        .rb-suggest-item:hover { background: #EDF0E9; }
        .rb-tab { cursor: pointer; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 500; }
        .rb-tab.active { background: #14413D; color: #F4F2EA; }
        .rb-tab.inactive { background: transparent; color: #5B6960; }
      `}</style>

      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>Recruiting board</h1>
          <p style={styles.sub}>Track outreach to college tennis programs</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={styles.secondaryBtn} onClick={() => setProfileModalOpen(true)}>
            Your info
          </button>
          <button style={styles.addBtn} onClick={openAdd}>
            <Plus size={16} /> Add school
          </button>
        </div>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statNum}>{stats.total}</div>
          <div style={styles.statLabel}>Schools tracked</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNum}>{stats.replied}</div>
          <div style={styles.statLabel}>Replies received</div>
        </div>
        <div style={{ ...styles.statCard, ...(stats.overdue > 0 ? styles.statCardAlert : {}) }}>
          <div style={{ ...styles.statNum, ...(stats.overdue > 0 ? { color: "#B23A2E" } : {}) }}>
            {stats.overdue}
          </div>
          <div style={styles.statLabel}>Follow-ups overdue</div>
        </div>
        <div style={{ ...styles.statCard, ...(stats.deadlinesSoon > 0 ? styles.statCardWarn : {}) }}>
          <div style={{ ...styles.statNum, ...(stats.deadlinesSoon > 0 ? { color: "#8A5A12" } : {}) }}>
            {stats.deadlinesSoon}
          </div>
          <div style={styles.statLabel}>Deadlines in 14 days</div>
        </div>
      </div>

      <div style={styles.toolbar}>
        <div style={styles.searchWrap}>
          <Search size={15} color="#5B6960" style={{ position: "absolute", left: 10, top: 10 }} />
          <input
            className="rb-input"
            style={{ paddingLeft: 32 }}
            placeholder="Search school or coach"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select className="rb-select" style={{ width: 130 }} value={divFilter} onChange={(e) => setDivFilter(e.target.value)}>
          <option>All</option>
          {DIVISIONS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select
          className="rb-select"
          style={{ width: 130 }}
          value={fitFilter}
          onChange={(e) => setFitFilter(e.target.value)}
          disabled={!profile.utr}
          title={!profile.utr ? "Add your UTR under Your info to filter by fit" : ""}
        >
          <option>All</option>
          <option value="Reach">Reach</option>
          <option value="Target">Target</option>
          <option value="Likely">Likely</option>
        </select>
      </div>

      {!profile.utr && (
        <div style={styles.legendHint}>
          Add your UTR under "Your info" to see reach / target / likely coloring on divisions.
        </div>
      )}
      {profile.utr && (
        <div style={styles.legendRow}>
          <span style={{ ...styles.legendChip, background: CLASS_STYLE.reach.bg, color: CLASS_STYLE.reach.text }}>
            Reach
          </span>
          <span style={{ ...styles.legendChip, background: CLASS_STYLE.target.bg, color: CLASS_STYLE.target.text }}>
            Target
          </span>
          <span style={{ ...styles.legendChip, background: CLASS_STYLE.likely.bg, color: CLASS_STYLE.likely.text }}>
            Likely
          </span>
          <span style={styles.legendNote}>rough benchmarks, not school-specific \u2014 verify for schools you're serious about</span>
        </div>
      )}

      {saveError && (
        <div style={styles.errorBanner}>Changes aren't saving right now. Keep working \u2014 try again shortly.</div>
      )}

      {loading ? (
        <div style={styles.empty}>Loading your board\u2026</div>
      ) : filtered.length === 0 && schools.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyTitle}>No schools yet</div>
          <div style={styles.emptySub}>Add the first program you're reaching out to.</div>
          <button style={{ ...styles.addBtn, marginTop: 14 }} onClick={openAdd}>
            <Plus size={16} /> Add school
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>No matches. Try a different search or filter.</div>
      ) : (
        <div style={styles.board}>
          {columns.map((col) => (
            <div key={col.label} style={styles.column}>
              <div style={styles.columnHeader}>
                <span style={styles.columnTitle}>{col.label}</span>
                <span style={styles.columnCount}>{col.items.length}</span>
              </div>
              <div style={styles.columnBody}>
                {col.items.length === 0 ? (
                  <div style={styles.columnEmpty}>No schools</div>
                ) : (
                  col.items.map((s) => renderCard(s))
                )}
              </div>
            </div>
          ))}
        </div>
      )}


      {confirmDelete && (
        <div style={styles.overlay}>
          <div style={styles.confirmBox}>
            <div style={styles.confirmText}>Remove this school from your board?</div>
            <div style={styles.confirmActions}>
              <button style={styles.secondaryBtn} onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button style={styles.dangerBtn} onClick={() => removeSchool(confirmDelete)}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {profileModalOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal} style={{ maxWidth: 360 }}>
            <div style={styles.modalHeader}>
              <span style={styles.modalTitle}>Your info</span>
              <button style={styles.iconBtn} onClick={() => setProfileModalOpen(false)} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <div style={styles.formGrid}>
              <label style={styles.label}>
                Name
                <input
                  className="rb-input"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Your full name"
                />
              </label>
              <label style={styles.label}>
                Graduation year
                <input
                  className="rb-input"
                  value={profile.gradYear}
                  onChange={(e) => setProfile({ ...profile, gradYear: e.target.value })}
                  placeholder="2027"
                />
              </label>
              <label style={styles.label}>
                Current UTR (optional)
                <input
                  className="rb-input"
                  value={profile.utr}
                  onChange={(e) => setProfile({ ...profile, utr: e.target.value })}
                  placeholder="8.5"
                />
              </label>
              <label style={styles.label}>
                Target division
                <select
                  className="rb-select"
                  value={profile.targetDivision}
                  onChange={(e) => setProfile({ ...profile, targetDivision: e.target.value })}
                >
                  <option value="">Show all divisions</option>
                  {DIVISIONS.map((d) => (
                    <option key={d} value={d}>
                      {d} only
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div style={styles.modalActions}>
              <button
                style={styles.primaryBtn}
                onClick={() => {
                  saveProfile(profile);
                  setProfileModalOpen(false);
                }}
              >
                Save
              </button>
            </div>
            <div style={styles.hintText}>
              Target division filters the school search below so off-level programs don't show up. Everything here is
              used only to fill in the email templates \u2014 nothing is sent anywhere automatically.
            </div>
          </div>
        </div>
      )}

      {templateFor && (
        <div style={styles.overlay}>
          <div style={styles.modal} style={{ maxWidth: 480 }}>
            <div style={styles.modalHeader}>
              <span style={styles.modalTitle}>{templateFor.school}</span>
              <button style={styles.iconBtn} onClick={() => setTemplateFor(null)} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              <span
                className={`rb-tab ${templateTab === "initial" ? "active" : "inactive"}`}
                onClick={() => setTemplateTab("initial")}
              >
                Initial email
              </span>
              <span
                className={`rb-tab ${templateTab === "followup" ? "active" : "inactive"}`}
                onClick={() => setTemplateTab("followup")}
              >
                Follow-up email
              </span>
            </div>
            <textarea
              className="rb-textarea"
              readOnly
              rows={11}
              value={templateText}
              style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, lineHeight: 1.5 }}
              onFocus={(e) => e.target.select()}
            />
            <div style={styles.modalActions}>
              <button style={styles.primaryBtn} onClick={copyTemplate}>
                {copied ? (
                  <>
                    <Check size={14} style={{ marginRight: 5 }} /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} style={{ marginRight: 5 }} /> Copy text
                  </>
                )}
              </button>
            </div>
            {!profile.name && (
              <div style={styles.hintText}>
                Add your name under "Your info" to personalize this automatically.
              </div>
            )}
          </div>
        </div>
      )}

      {modalOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <span style={styles.modalTitle}>{draft.id ? "Edit school" : "Add school"}</span>
              <button style={styles.iconBtn} onClick={() => setModalOpen(false)} aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <div style={styles.formGrid}>
              <label style={styles.label} ref={suggestRef}>
                School
                {!profile.targetDivision && (
                  <span style={styles.filterNudge}>
                    No target division set \u2014 showing all levels. Set one under "Your info" to filter.
                  </span>
                )}
                <div style={{ position: "relative" }}>
                  <input
                    className="rb-input"
                    value={draft.school}
                    onChange={(e) => {
                      setDraft({ ...draft, school: e.target.value });
                      setSchoolSuggestOpen(true);
                    }}
                    onFocus={() => setSchoolSuggestOpen(true)}
                    placeholder={
                      profile.targetDivision ? `Start typing (${profile.targetDivision} programs only)` : "Start typing, e.g. FSU"
                    }
                    autoComplete="off"
                  />
                  {schoolSuggestOpen && schoolMatches.length > 0 && (
                    <div style={styles.suggestBox}>
                      {schoolMatches.map(([name, division]) => {
                        const cls = classifyDivision(profile.utr, division, name);
                        const clsStyle = cls ? CLASS_STYLE[cls] : null;
                        return (
                          <div
                            key={name}
                            className="rb-suggest-item"
                            style={styles.suggestItem}
                            onClick={() => pickSuggestion(name, division)}
                          >
                            <span>
                              {name}
                              {SCHOOL_INFO[name] && <span style={styles.dataDot} title="Acceptance rate & conference on file" />}
                            </span>
                            <span
                              style={{
                                ...styles.suggestDiv,
                                ...(clsStyle ? { background: clsStyle.bg, color: clsStyle.text, padding: "1px 6px", borderRadius: 4 } : {}),
                              }}
                            >
                              {division}
                              {clsStyle ? ` \u00b7 ${clsStyle.label}` : ""}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </label>

              <label style={styles.label}>
                Division
                <select
                  className="rb-select"
                  value={draft.division}
                  onChange={(e) => setDraft({ ...draft, division: e.target.value })}
                >
                  {DIVISIONS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </label>

              <label style={styles.label}>
                Coach name
                <input
                  className="rb-input"
                  value={draft.coachName}
                  onChange={(e) => setDraft({ ...draft, coachName: e.target.value })}
                  placeholder="First and last name"
                />
              </label>

              <label style={styles.label}>
                Coach email
                <input
                  className="rb-input"
                  value={draft.coachEmail}
                  onChange={(e) => setDraft({ ...draft, coachEmail: e.target.value })}
                  placeholder="coach@school.edu"
                />
              </label>

              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ ...styles.label, flex: 1 }}>
                  Acceptance rate
                  <input
                    className="rb-input"
                    value={draft.acceptanceRate}
                    onChange={(e) => setDraft({ ...draft, acceptanceRate: e.target.value })}
                    placeholder="e.g. 42%"
                  />
                </label>
              </div>

              <label style={styles.label}>
                Program info
                <textarea
                  className="rb-textarea"
                  rows={2}
                  value={draft.programInfo}
                  onChange={(e) => setDraft({ ...draft, programInfo: e.target.value })}
                  placeholder="Anything else you want to remember"
                />
              </label>

              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ ...styles.label, flex: 1 }}>
                  Conference
                  <input
                    className="rb-input"
                    value={draft.conference}
                    onChange={(e) => setDraft({ ...draft, conference: e.target.value })}
                    placeholder="e.g. ACC"
                  />
                </label>
              </div>

              <label style={styles.label}>
                Academics snapshot
                <input
                  className="rb-input"
                  value={draft.academics}
                  onChange={(e) => setDraft({ ...draft, academics: e.target.value })}
                  placeholder="Size, public/private, setting"
                />
              </label>

              <label style={styles.label}>
                Tennis program note
                <textarea
                  className="rb-textarea"
                  rows={2}
                  value={draft.tennisNote}
                  onChange={(e) => setDraft({ ...draft, tennisNote: e.target.value })}
                  placeholder="Program reputation, recent history"
                />
              </label>

              <label style={styles.label}>
                Stage
                <select
                  className="rb-select"
                  value={draft.stage}
                  onChange={(e) => setDraft({ ...draft, stage: Number(e.target.value) })}
                >
                  {STAGES.map((s, i) => (
                    <option key={s} value={i}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ ...styles.label, flex: 1 }}>
                  Last contact
                  <input
                    className="rb-input"
                    type="date"
                    value={draft.lastContact}
                    onChange={(e) => setDraft({ ...draft, lastContact: e.target.value })}
                  />
                </label>
                <label style={{ ...styles.label, flex: 1 }}>
                  Next follow-up
                  <input
                    className="rb-input"
                    type="date"
                    value={draft.nextFollowUp}
                    onChange={(e) => setDraft({ ...draft, nextFollowUp: e.target.value })}
                  />
                </label>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <label style={{ ...styles.label, flex: 1 }}>
                  Application plan
                  <select
                    className="rb-select"
                    value={draft.applicationPlan}
                    onChange={(e) => setDraft({ ...draft, applicationPlan: e.target.value })}
                  >
                    <option value="">Not set</option>
                    {APPLICATION_PLANS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </label>
                <label style={{ ...styles.label, flex: 1 }}>
                  Application deadline
                  <input
                    className="rb-input"
                    type="date"
                    value={draft.applicationDeadline}
                    onChange={(e) => setDraft({ ...draft, applicationDeadline: e.target.value })}
                  />
                </label>
              </div>

              {draft.deadlineNote && (
                <div style={styles.hintText}>{`Typical pattern: ${draft.deadlineNote} \u2014 confirm on the school's site before relying on it.`}</div>
              )}

              <label style={styles.label}>
                Notes
                <textarea
                  className="rb-textarea"
                  rows={3}
                  value={draft.notes}
                  onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                  placeholder="What did they say? What's the plan?"
                />
              </label>
            </div>

            <div style={styles.modalActions}>
              <button style={styles.secondaryBtn} onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button style={styles.primaryBtn} onClick={saveDraft} disabled={!draft.school.trim()}>
                {draft.id ? "Save changes" : "Add school"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    background: "#EDF0E9",
    minHeight: "100%",
    padding: "28px 20px 60px",
    color: "#131C17",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 12,
    maxWidth: 1400,
    margin: "0 auto 18px",
  },
  h1: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: 26,
    margin: 0,
    color: "#14413D",
  },
  sub: { margin: "4px 0 0", fontSize: 14, color: "#5B6960" },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#14413D",
    color: "#F4F2EA",
    border: "none",
    borderRadius: 6,
    padding: "9px 14px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'IBM Plex Sans', sans-serif",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 10,
    maxWidth: 1400,
    margin: "0 auto 16px",
  },
  statCard: {
    background: "#FFFFFF",
    border: "1px solid #C9CFC3",
    borderRadius: 8,
    padding: "12px 14px",
  },
  statCardAlert: { borderColor: "#B23A2E" },
  statCardWarn: { borderColor: "#8A5A12" },
  statNum: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: 22,
    color: "#14413D",
  },
  statLabel: { fontSize: 12, color: "#5B6960", marginTop: 2 },
  toolbar: {
    display: "flex",
    gap: 10,
    maxWidth: 1400,
    margin: "0 auto 16px",
  },
  searchWrap: { position: "relative", flex: 1 },
  legendHint: {
    maxWidth: 1400,
    margin: "0 auto 14px",
    fontSize: 12,
    color: "#5B6960",
  },
  legendRow: {
    maxWidth: 1400,
    margin: "0 auto 14px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  legendChip: {
    fontSize: 11,
    fontFamily: "'IBM Plex Mono', monospace",
    padding: "2px 8px",
    borderRadius: 4,
  },
  legendNote: {
    fontSize: 11,
    color: "#5B6960",
  },
  filterNudge: {
    fontSize: 11,
    color: "#8A5A12",
    fontWeight: 400,
  },
  errorBanner: {
    maxWidth: 1400,
    margin: "0 auto 12px",
    background: "#FCEBEA",
    color: "#B23A2E",
    fontSize: 13,
    padding: "8px 12px",
    borderRadius: 6,
  },
  empty: {
    maxWidth: 1400,
    margin: "40px auto",
    textAlign: "center",
    color: "#5B6960",
    fontSize: 14,
  },
  emptyTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: 18,
    color: "#14413D",
  },
  emptySub: { marginTop: 4 },
  board: {
    maxWidth: 1400,
    margin: "0 auto",
    display: "flex",
    gap: 12,
    overflowX: "auto",
    paddingBottom: 12,
  },
  column: {
    minWidth: 260,
    maxWidth: 280,
    flexShrink: 0,
    background: "#E6E9E1",
    borderRadius: 10,
    padding: 10,
    maxHeight: "75vh",
    display: "flex",
    flexDirection: "column",
  },
  columnHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "4px 4px 10px",
  },
  columnTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: 13,
    color: "#14413D",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  columnCount: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    color: "#5B6960",
    background: "#FFFFFF",
    borderRadius: 10,
    padding: "1px 7px",
  },
  columnBody: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    overflowY: "auto",
    paddingRight: 2,
  },
  columnEmpty: {
    fontSize: 12,
    color: "#8B9088",
    textAlign: "center",
    padding: "16px 6px",
  },
  card: {
    background: "#FFFFFF",
    border: "1px solid #C9CFC3",
    borderRadius: 10,
    padding: "14px 16px",
  },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  schoolName: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: 16,
    color: "#131C17",
  },
  divBadge: {
    display: "inline-block",
    marginTop: 4,
    fontSize: 11,
    fontFamily: "'IBM Plex Mono', monospace",
    color: "#14413D",
    background: "#E1E8DE",
    padding: "2px 7px",
    borderRadius: 4,
  },
  cardActions: { display: "flex", gap: 4 },
  iconBtn: {
    background: "transparent",
    border: "none",
    color: "#5B6960",
    cursor: "pointer",
    padding: 4,
    display: "flex",
  },
  dotsRow: { display: "flex", alignItems: "center", gap: 6, margin: "12px 0 10px" },
  dotWrap: { display: "flex" },
  stageLabel: {
    marginLeft: 8,
    fontSize: 12,
    fontFamily: "'IBM Plex Mono', monospace",
    color: "#5B6960",
  },
  metaRow: { display: "flex", gap: 14, fontSize: 13, color: "#3A423C", flexWrap: "wrap" },
  metaItem: {},
  programInfo: {
    fontSize: 12,
    color: "#5B6960",
    marginTop: 4,
    fontStyle: "italic",
  },
  academicsLine: {
    fontSize: 12,
    color: "#3A423C",
    marginTop: 6,
  },
  tennisLine: {
    fontSize: 12,
    color: "#3A423C",
    marginTop: 2,
  },
  dateRow: {
    display: "flex",
    gap: 18,
    fontSize: 12,
    color: "#5B6960",
    marginTop: 8,
    flexWrap: "wrap",
  },
  dateItem: {},
  dateMono: { fontFamily: "'IBM Plex Mono', monospace", color: "#131C17" },
  overdue: { color: "#B23A2E", fontWeight: 500 },
  deadlineRow: { marginTop: 6 },
  deadlineChip: {
    display: "inline-block",
    fontSize: 11,
    fontFamily: "'IBM Plex Mono', monospace",
    padding: "2px 8px",
    borderRadius: 4,
  },
  deadlineNormal: { background: "#E1E8DE", color: "#14413D" },
  deadlineSoon: { background: "#FBF0DC", color: "#8A5A12" },
  deadlinePassed: { background: "#FCEBEA", color: "#B23A2E" },
  notes: {
    marginTop: 10,
    fontSize: 13,
    color: "#3A423C",
    borderTop: "1px solid #E7E9E2",
    paddingTop: 8,
  },
  templateRow: {
    display: "flex",
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTop: "1px solid #E7E9E2",
    flexWrap: "wrap",
    alignItems: "center",
  },
  templateBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    background: "transparent",
    border: "1px solid #C9CFC3",
    color: "#14413D",
    borderRadius: 6,
    padding: "5px 10px",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "'IBM Plex Sans', sans-serif",
  },
  suggestChip: {
    fontSize: 11,
    color: "#B23A2E",
    fontFamily: "'IBM Plex Mono', monospace",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(19,28,23,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    zIndex: 50,
  },
  modal: {
    background: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    maxWidth: 420,
    maxHeight: "88vh",
    overflowY: "auto",
  },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  modalTitle: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, color: "#14413D" },
  formGrid: { display: "flex", flexDirection: "column", gap: 12 },
  label: { display: "flex", flexDirection: "column", gap: 5, fontSize: 12, color: "#5B6960", fontWeight: 500 },
  modalActions: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 18 },
  primaryBtn: {
    display: "flex",
    alignItems: "center",
    background: "#14413D",
    color: "#F4F2EA",
    border: "none",
    borderRadius: 6,
    padding: "9px 16px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'IBM Plex Sans', sans-serif",
  },
  secondaryBtn: {
    background: "transparent",
    color: "#5B6960",
    border: "1px solid #C9CFC3",
    borderRadius: 6,
    padding: "9px 16px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'IBM Plex Sans', sans-serif",
  },
  dangerBtn: {
    background: "#B23A2E",
    color: "#FFFFFF",
    border: "none",
    borderRadius: 6,
    padding: "9px 16px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'IBM Plex Sans', sans-serif",
  },
  confirmBox: {
    background: "#FFFFFF",
    borderRadius: 10,
    padding: 18,
    width: "100%",
    maxWidth: 320,
  },
  confirmText: { fontSize: 14, color: "#131C17", marginBottom: 14 },
  confirmActions: { display: "flex", justifyContent: "flex-end", gap: 8 },
  suggestBox: {
    position: "absolute",
    top: "calc(100% + 4px)",
    left: 0,
    right: 0,
    background: "#FFFFFF",
    border: "1px solid #C9CFC3",
    borderRadius: 6,
    zIndex: 10,
    maxHeight: 180,
    overflowY: "auto",
  },
  suggestItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "7px 10px",
    fontSize: 13,
    cursor: "pointer",
  },
  suggestDiv: {
    fontSize: 11,
    fontFamily: "'IBM Plex Mono', monospace",
    color: "#5B6960",
  },
  dataDot: {
    display: "inline-block",
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#2F6B33",
    marginLeft: 6,
  },
  hintText: {
    fontSize: 12,
    color: "#5B6960",
    marginTop: 10,
  },
};
