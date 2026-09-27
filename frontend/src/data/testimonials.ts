export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

/**
 * PLACEHOLDERS ONLY — edit before publishing.
 * Real testimonials need the actual person's words and their permission to publish.
 * I have not invented realistic-sounding quotes attributed to fake people, because
 * published fake testimonials are misleading to visitors. Replace each entry below
 * with a real quote, name, and role — or delete an entry to shorten the list.
 * The section on the homepage renders nothing if this array is empty.
 */
export const testimonials: Testimonial[] = [
  { quote: "Replace this with a real quote about working with you.", name: "Placeholder Name", role: "Placeholder Role, Placeholder Company" },
  { quote: "Replace this with a real quote about a specific project or collaboration.", name: "Placeholder Name", role: "Placeholder Role, Placeholder Company" },
];
