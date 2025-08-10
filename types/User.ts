import { ExploreTwoTone } from "@mui/icons-material";

export interface User {
  id: string;
  email: string;
  subscription_tier?: 'free' | 'pro'; 
}
