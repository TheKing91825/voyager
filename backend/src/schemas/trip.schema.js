import { z } from 'zod';

export const createTripSchema = z.object({
  name: z.string().min(1, "Trip name is required").max(200, "Name too long"),
  location: z.string().min(1, "Location is required").max(200, "Location too long"),
  start_date: z.string().datetime("Invalid start date format"),
  end_date: z.string().datetime("Invalid end date format"),
  description: z.string().max(2000, "Description too long").optional()
});

export const validateCreateTrip = (data) => createTripSchema.parse(data);
