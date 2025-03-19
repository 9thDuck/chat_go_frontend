import { PaginatedResponse } from "./pagination";
import { ServerUser } from "./user";

export type ContactsResponse = PaginatedResponse<ServerUser>
