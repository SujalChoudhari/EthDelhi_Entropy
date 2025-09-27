"use client";

import {
  RiArrowRightSLine,
  RiBellLine,
  RiCheckLine,
  RiLogoutBoxLine,
  RiMoonLine,
  RiPaletteLine,
  RiShieldLine,
  RiSmartphoneLine,
  RiSunLine,
  RiUserLine
} from "@remixicon/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { themes } from "@/types/theme";
import api from "@/utils/api";
import { toast } from "sonner";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

// Dummy user data for UI display
const dummyUser = {
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@example.com",
  phoneNumber: "+1 (555) 123-4567",
  gender: "male",
  address: "123 Main St, Anytown, USA",
  age: 30,
  username: "johndoe",
  user_id: "user_12345",
  role: "user"
};

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ElementType;
}

const settingsTabs: SettingsTab[] = [
  { id: "profile", label: "Profile", icon: RiUserLine },
  { id: "security", label: "Security", icon: RiShieldLine },
  { id: "notifications", label: "Notifications", icon: RiBellLine },
  { id: "appearance", label: "Appearance", icon: RiPaletteLine },
];

const colorSchemes = [
  { id: "zinc", name: "Neutral", class: "from-zinc-400 to-zinc-500" },
  { id: "slate", name: "Slate", class: "from-slate-400 to-slate-500" },
  { id: "stone", name: "Stone", class: "from-stone-400 to-stone-500" },
  { id: "gray", name: "Gray", class: "from-gray-400 to-gray-500" },
  { id: "neutral", name: "Neutral", class: "from-neutral-400 to-neutral-500" },
];

const ProfileSection = ({
  user,
  isEditing,
  setIsEditing,
  editableUser,
  setEditableUser,
}: {
  user: typeof dummyUser;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  editableUser: typeof dummyUser;
  setEditableUser: (value: typeof dummyUser) => void;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <div className="space-y-1">
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details and preferences</CardDescription>
      </div>
      {!isEditing ? (
        <Button
          variant="outline"
          onClick={() => setIsEditing(true)}
          className="shrink-0"
        >
          Edit Profile
        </Button>
      ) : null}
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            defaultValue={user.first_name}
            disabled={!isEditing}
            onChange={(e) =>
              setEditableUser({ ...editableUser, first_name: e.target.value })
            }
            className={!isEditing ? "bg-muted" : ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            defaultValue={user.last_name}
            disabled={!isEditing}
            onChange={(e) =>
              setEditableUser({ ...editableUser, last_name: e.target.value })
            }
            className={!isEditing ? "bg-muted" : ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            defaultValue={user.email}
            disabled={!isEditing}
            onChange={(e) =>
              setEditableUser({ ...editableUser, email: e.target.value })
            }
            className={!isEditing ? "bg-muted" : ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            defaultValue={user.phoneNumber}
            disabled={!isEditing}
            onChange={(e) =>
              setEditableUser({ ...editableUser, phoneNumber: e.target.value })
            }
            className={!isEditing ? "bg-muted" : ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            disabled={!isEditing}
            value={editableUser?.gender || ""}
            onValueChange={(value) =>
              setEditableUser({ ...editableUser, gender: value })
            }
          >
            <SelectTrigger className={!isEditing ? "bg-muted" : ""}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            defaultValue={user.address}
            disabled={!isEditing}
            onChange={(e) =>
              setEditableUser({ ...editableUser, address: e.target.value })
            }
            className={!isEditing ? "bg-muted" : ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            defaultValue={user.age}
            disabled={!isEditing}
            onChange={(e) =>
              setEditableUser({ ...editableUser, age: parseInt(e.target.value) })
            }
            className={!isEditing ? "bg-muted" : ""}
          />
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setIsEditing(false);
              setEditableUser(user);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              try {
                const response = await api(`/users/${user.user_id}?first_name=${encodeURIComponent(editableUser.first_name)}&last_name=${encodeURIComponent(editableUser.last_name)}&age=${editableUser.age}&gender=${encodeURIComponent(editableUser.gender)}&phone_number=${encodeURIComponent(editableUser.phoneNumber)}&address=${encodeURIComponent(editableUser.address)}&email=${encodeURIComponent(editableUser.email)}`, {
                  method: "PUT",
                });
                toast.success("Profile updated successfully!");
                setIsEditing(false);
              } catch (error) {
                toast.error("Failed to update profile.");
                console.error("Error updating profile:", error);
              }
            }}
          >
            Save Changes
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
);

const SecuritySection = ({ user }: { user: typeof dummyUser }) => {
  return <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Password & Authentication</CardTitle>
        <CardDescription>
          Manage your password and security preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold">Username</Label>
            <p className="text-sm text-muted-foreground">{user.username}</p>
            <Label className="font-semibold">User ID</Label>
            <p className="text-sm text-muted-foreground">{user.user_id}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-semibold">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-semibold">Password</Label>
              <p className="text-sm text-muted-foreground">
                Last changed 3 months ago
              </p>
            </div>
            <Button variant="outline" className="hover:bg-primary/10 transition-colors">
              Change Password
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
        <CardDescription>
          Manage your active sessions across devices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="default" className="w-full mb-4">
          Setup Passkey
        </Button>

        <div className="space-y-4">
          {[
            { device: "Windows PC", location: "London, UK", current: true },
            { device: "iPhone 13", location: "Manchester, UK", current: false },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <RiSmartphoneLine className="h-9 w-9 rounded-full bg-primary/10 p-2 text-primary" />
                <div>
                  <div className="font-medium">
                    {session.device}
                    {session.current && (
                      <Badge variant="secondary" className="ml-2">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{session.location}</p>
                </div>
              </div>
              {!session.current && (
                <Button variant="ghost" className="text-destructive hover:text-destructive">
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
};

const NotificationsSection = () => (
  <Card>
    <CardHeader>
      <CardTitle>Notification Preferences</CardTitle>
      <CardDescription>
        Choose what notifications you want to receive
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Email Notifications</h3>
          <div className="space-y-4">
            {[
              {
                title: "Security Alerts",
                description: "Get notified about security updates and unusual activity",
              },
              {
                title: "Account Updates",
                description: "Receive updates about your account activity",
              },
              {
                title: "Newsletter",
                description: "Receive our monthly newsletter and product updates",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{item.title}</Label>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <Switch defaultChecked={i < 2} />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-medium">Push Notifications</h3>
          <div className="space-y-4">
            {[
              {
                title: "Push Notifications",
                description: "Receive notifications on your desktop",
              },
              {
                title: "Quiet Hours",
                description: "Don't send notifications between 10 PM and 8 AM",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{item.title}</Label>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <Switch defaultChecked={i === 0} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const AppearanceSection = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<string>("zinc");
  const isDarkMode = resolvedTheme === "dark";

  const applyTheme = (themeId: string, isDark: boolean) => {
    const theme = themes.find((t) => t.id === themeId);
    if (!theme) return;

    const variables = isDark ? theme.variables.dark : theme.variables.light;
    const root = document.documentElement;

    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    // Store the theme preference
    localStorage.setItem("theme-color", themeId);
    setSelectedTheme(themeId);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme-color") || "zinc";
    applyTheme(savedTheme, isDarkMode);
  }, [isDarkMode]); // Re-apply theme when dark mode changes



  return (
    <div className="space-y-6">
       
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Customize the appearance of the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
              <Button variant="outline" size="icon" onClick={() => setTheme(isDarkMode ? "light" : "dark")}>
                {isDarkMode ? (
                  <RiSunLine className="h-4 w-4" />
                ) : (
                  <RiMoonLine className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Color Scheme</CardTitle>
          <CardDescription>
            Choose your preferred color scheme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => applyTheme(theme.id, isDarkMode)}
                className={`
                  group relative aspect-video overflow-hidden rounded-lg border-2 transition-all
                  ${selectedTheme === theme.id
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-muted"
                  }
                `}
                style={{
                  background: `hsl(${isDarkMode ? theme.variables.dark.primary : theme.variables.light.primary})`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/5">
                  <span className="text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {theme.name}
                  </span>
                  {selectedTheme === theme.id && (
                    <RiCheckLine className="absolute right-2 top-2 h-4 w-4 text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(dummyUser);
  const [editableUser, setEditableUser] = useState(dummyUser);

  const { open } = useSidebar();

  const handleSignOut = () => {
    // Clear any local storage or auth tokens here if needed
    router.push("/auth/login");
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl bg-background">
       <SidebarTrigger
                data-state={open ? "invisible" : "visible"}
                className="peer size-7 text-muted-foreground/80 hover:text-foreground/80 hover:bg-transparent! sm:-ms-1.5 lg:data-[state=invisible]:opacity-0 lg:data-[state=invisible]:pointer-events-none transition-opacity ease-in-out duration-200"
                
              />
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <Badge variant="secondary" className="px-4 py-1">
          {user.role.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar Navigation */}
        <Card className="col-span-12 md:col-span-3 border-none shadow-none bg-background">
          <CardContent className="p-0 flex flex-col justify-center">
            <nav className="flex flex-col">
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-3 px-4 py-3 text-sm transition-colors relative
                    ${activeTab === tab.id
                      ? "text-primary font-medium bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }
                  `}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <RiArrowRightSLine className="ml-auto h-4 w-4" />
                  )}
                </button>
              ))}
            </nav>
            <Separator className="my-2" />
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/5 hover:text-destructive"
              onClick={handleSignOut}
            >
              <RiLogoutBoxLine className="h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="col-span-12 md:col-span-9 space-y-6">
          {activeTab === "profile" && (
            <ProfileSection
              user={user}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              editableUser={editableUser}
              setEditableUser={setEditableUser}
            />
          )}
          {activeTab === "security" && <SecuritySection user={user} />}
          {activeTab === "notifications" && <NotificationsSection />}
          {activeTab === "appearance" && (
            <AppearanceSection />
          )}
        </div>
      </div>
    </div>
  );
}