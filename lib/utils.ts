import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and merges dynamic class names.
 * 
 * @param {...ClassValue} inputs - Class names that can be conditionally combined.
 * @returns {string} - A merged string of class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs)); // First apply clsx to join classes, then resolve conflicts with twMerge.
}
