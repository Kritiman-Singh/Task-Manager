import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile, changePassword } from "@/services/task.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/utils/auth";
import toast from "react-hot-toast";
import { User, KeyRound, Save } from "lucide-react";

export default function SettingsPage() {
  const authUser = useAuthStore((s) => s.user);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({ userName: "", image: "" });
  const [pwdForm, setPwdForm] = useState({ currentPassword: "", newPassword: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
        setProfileForm({ userName: data.userName || "", image: data.image || "" });
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const updated = await updateUserProfile(profileForm);
      setProfile(updated);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (!pwdForm.newPassword || pwdForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    setSavingPwd(true);
    try {
      await changePassword(pwdForm);
      toast.success("Password updated successfully");
      setPwdForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update password");
    } finally {
      setSavingPwd(false);
    }
  };

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center text-muted-foreground animate-pulse">
        Loading settings…
      </div>
    );
  }

  const isLocalUser = profile?.provider === "LOCAL";
  const initials = profile?.userName?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your profile and account settings</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" /> Profile
          </CardTitle>
          <CardDescription>Update your display name and avatar URL</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-5">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.image} alt={profile?.userName} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{profile?.userName}</p>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
              <Badge variant="secondary" className="mt-1 text-xs">{profile?.provider}</Badge>
            </div>
          </div>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="profile-name">Display Name</Label>
              <Input
                id="profile-name"
                value={profileForm.userName}
                onChange={(e) => setProfileForm((p) => ({ ...p, userName: e.target.value }))}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="profile-image">Avatar URL</Label>
              <Input
                id="profile-image"
                value={profileForm.image}
                onChange={(e) => setProfileForm((p) => ({ ...p, image: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <Button id="btn-save-profile" type="submit" disabled={savingProfile}>
              <Save className="h-4 w-4 mr-1" />
              {savingProfile ? "Saving…" : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password */}
      {isLocalUser ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <KeyRound className="h-4 w-4" /> Change Password
            </CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSave} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="current-pwd">Current Password</Label>
                <Input
                  id="current-pwd"
                  type="password"
                  value={pwdForm.currentPassword}
                  onChange={(e) => setPwdForm((p) => ({ ...p, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new-pwd">New Password</Label>
                <Input
                  id="new-pwd"
                  type="password"
                  value={pwdForm.newPassword}
                  onChange={(e) => setPwdForm((p) => ({ ...p, newPassword: e.target.value }))}
                  placeholder="Min 6 characters"
                  minLength={6}
                  required
                />
              </div>
              <Button id="btn-save-password" type="submit" disabled={savingPwd}>
                <Save className="h-4 w-4 mr-1" />
                {savingPwd ? "Updating…" : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-6 text-center text-muted-foreground text-sm">
            <KeyRound className="h-6 w-6 mx-auto mb-2 opacity-50" />
            Password management is not available for {profile?.provider} accounts.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
