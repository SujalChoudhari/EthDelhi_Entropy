// utils/withAuth.tsx
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/AppProvider";
import Loading from "@/components/Loading";
import RequireAuth from "@/components/RequireAuth";
import { useEffect } from "react";

interface WithAuthOptions {
    redirect?: boolean; // Whether to redirect or just render null
}

/**
 * Example usage:
 * ```
 * // pages/protected-page.tsx
 * import withAuth from "../utils/withAuth";
 * 
 * function ProtectedPage() {
 *   return <div>This is a protected page.</div>;
 * }
 * 
 * export default withAuth(ProtectedPage);
 * ```
 */

const withAuth = <P extends object>(
    WrappedComponent: React.ComponentType<P>,
    options: WithAuthOptions = { redirect: true }
) => {
    const WithAuthComponent: React.FC<P> = (props) => {
        const { user, loading } = useUser();
        const router = useRouter();

        useEffect(() => {
            if (!loading && !user && options.redirect) {
                router.push("/signin"); // Or your sign-in route
            }
        }, [user, loading, router, options.redirect]);

        if (loading) {
            return <Loading />;
        }

        if (!user && options.redirect) {
            return null; // Redirect is handled by useEffect
        }

        if (!user && !options.redirect) {
            return <RequireAuth />; // Render RequireAuth component
        }

        return <WrappedComponent {...props} />;
    };

    WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"
        })`;

    return WithAuthComponent;
};

export default withAuth;
