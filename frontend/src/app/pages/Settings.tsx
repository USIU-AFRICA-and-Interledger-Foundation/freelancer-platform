import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle, User, Shield } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { usersApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { CURRENCIES } from "../utils/currencies";

export function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [clientForm, setClientForm] = useState({
    fullName: "",
    companyName: "",
    currencyPreference: "USD",
  });

  const [freelancerForm, setFreelancerForm] = useState({
    fullName: "",
    mpesaPhone: "",
    bio: "",
    skills: "",
  });

  useEffect(() => {
    usersApi.getMe()
      .then((res) => {
        const { profile } = res.data;
        if (!profile) return;
        if (user?.role === "client") {
          setClientForm({
            fullName: profile.full_name || "",
            companyName: profile.company_name || "",
            currencyPreference: profile.currency_preference || "USD",
          });
        } else {
          setFreelancerForm({
            fullName: profile.full_name || "",
            mpesaPhone: (profile.mpesa_phone || "").replace("+254", ""),
            bio: profile.bio || "",
            skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : "",
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      if (user?.role === "client") {
        await usersApi.updateProfile({
          fullName: clientForm.fullName,
          companyName: clientForm.companyName,
          currencyPreference: clientForm.currencyPreference,
        });
      } else {
        const skills = freelancerForm.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        await usersApi.updateProfile({
          fullName: freelancerForm.fullName,
          mpesaPhone: freelancerForm.mpesaPhone ? `+254${freelancerForm.mpesaPhone}` : undefined,
          bio: freelancerForm.bio,
          skills,
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Account Info */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold">Account</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-medium ${user?.role === "client" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
            {user?.role === "client" ? "Client" : "Freelancer"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg p-3">
          <Shield className="w-4 h-4" />
          <span>Account secured with encrypted password storage</span>
        </div>
      </Card>

      {/* Profile Settings */}
      <Card className="p-6 mb-6">
        <h2 className="font-semibold mb-6">Profile Settings</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {saved && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Settings saved successfully!
          </div>
        )}

        <div className="space-y-5">
          {user?.role === "client" ? (
            <>
              <div>
                <Label>Full Name</Label>
                <Input
                  className="mt-2"
                  value={clientForm.fullName}
                  onChange={(e) => setClientForm({ ...clientForm, fullName: e.target.value })}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label>Company Name</Label>
                <Input
                  className="mt-2"
                  value={clientForm.companyName}
                  onChange={(e) => setClientForm({ ...clientForm, companyName: e.target.value })}
                  placeholder="Your company (optional)"
                />
              </div>
              <div>
                <Label>Preferred Currency</Label>
                <Select
                  value={clientForm.currencyPreference}
                  onValueChange={(val) => setClientForm({ ...clientForm, currencyPreference: val })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.flag} {c.code} - {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              <div>
                <Label>Full Name</Label>
                <Input
                  className="mt-2"
                  value={freelancerForm.fullName}
                  onChange={(e) => setFreelancerForm({ ...freelancerForm, fullName: e.target.value })}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label>M-Pesa Phone Number</Label>
                <div className="flex gap-2 mt-2">
                  <div className="w-20 flex items-center justify-center border rounded-lg bg-gray-50 text-sm font-medium">
                    +254
                  </div>
                  <Input
                    type="tel"
                    placeholder="712345678"
                    value={freelancerForm.mpesaPhone}
                    onChange={(e) => setFreelancerForm({ ...freelancerForm, mpesaPhone: e.target.value })}
                    maxLength={9}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">This is where you'll receive M-Pesa payments</p>
              </div>
              <div>
                <Label>Bio</Label>
                <Input
                  className="mt-2"
                  value={freelancerForm.bio}
                  onChange={(e) => setFreelancerForm({ ...freelancerForm, bio: e.target.value })}
                  placeholder="Short description of your work"
                />
              </div>
              <div>
                <Label>Skills</Label>
                <Input
                  className="mt-2"
                  value={freelancerForm.skills}
                  onChange={(e) => setFreelancerForm({ ...freelancerForm, skills: e.target.value })}
                  placeholder="React, Node.js, UI/UX Design (comma-separated)"
                />
                <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
              </div>
            </>
          )}

          <Button onClick={handleSave} disabled={saving} className="w-full" size="lg">
            {saving ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" /> Save Settings</>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
