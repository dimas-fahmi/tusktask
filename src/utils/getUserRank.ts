import { RANKS } from "@/src/app/data/userRank";

export function getUserRank(score: number) {
  return RANKS.reduce((current, rank) => {
    return rank.min <= score ? rank : current;
  }, RANKS[0]);
}

export function getNextRank(score: number) {
  return RANKS.find((rank) => rank.min > score);
}

// Binary search version
// function getUserRank(score: number) {
//   let left = 0;
//   let right = ranks.length - 1;
//   let result = ranks[0];

//   while (left <= right) {
//     const mid = Math.floor((left + right) / 2);

//     if (ranks[mid].min <= score) {
//       result = ranks[mid];
//       left = mid + 1;
//     } else {
//       right = mid - 1;
//     }
//   }

//   return result;
// }
