import { defaultGet } from '../api';
import { Wc3Races } from './wc3.model';

export async function getWc3Races() {
  const res = await defaultGet<Wc3Races[]>('/wc3/races', false);
  return res;
}

export async function getClassicWc3Races() {
  const res = await defaultGet<Wc3Races[]>('/wc3/classic-races', false);
  return res;
}
