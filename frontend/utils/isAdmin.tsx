// utils/isAdmin.tsx
import { useUser } from "@/providers/AppProvider";


/**
 * Example Usage:
 * ```
 * // utils/isAdmin.tsx
 * import { useUser } from "../components/AuthProvider";
 * 
 * const isAdmin = (): boolean => {
 *   const { user } = useUser();
 *   return user ? user.isAdmin : false;
 * };
 * 
 * export default isAdmin;
 * ```
 */
const isAdmin = (): boolean => {
    const { user } = useUser();
    return user ? user.isAdmin : false;
};

export default isAdmin;
