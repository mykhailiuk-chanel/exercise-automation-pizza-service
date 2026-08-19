"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AddressDto } from "@pizza/shared-types";
import { useAuth } from "@/components/auth-provider";
import { RequiredMark } from "@/components/required-mark";
import {
  createAddress,
  deleteAddress,
  fetchAddresses,
} from "@/lib/addresses-client";

const EMPTY_FORM = {
  label: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  isDefault: false,
};

export function AddressesView() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<AddressDto[] | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/account/login?redirect=/account/addresses");
    }
  }, [isAuthLoading, user, router]);

  useEffect(() => {
    if (user) {
      fetchAddresses().then(setAddresses);
    }
  }, [user]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await createAddress(form);
      setAddresses(await fetchAddresses());
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't add address");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteAddress(id);
    setAddresses(await fetchAddresses());
  }

  if (isAuthLoading || !user) return null;

  return (
    <div className="mt-8">
      {addresses === null ? (
        <p data-testid="addresses-loading" qa-data="addresses-loading">
          Loading…
        </p>
      ) : addresses.length === 0 ? (
        <p
          data-testid="addresses-empty"
          qa-data="addresses-empty"
          className="text-zinc-600 dark:text-zinc-400"
        >
          No addresses yet — add one below.
        </p>
      ) : (
        <ul
          data-testid="addresses-list"
          qa-data="addresses-list"
          className="flex flex-col gap-3"
        >
          {addresses.map((address) => (
            <li
              key={address.id}
              data-testid="address-item"
              qa-data="address-item"
              className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div>
                <p className="font-semibold">
                  {address.label}
                  {address.isDefault && (
                    <span className="ml-2 rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium dark:bg-zinc-800">
                      Default
                    </span>
                  )}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {address.street}, {address.city}, {address.state}{" "}
                  {address.zip}, {address.country}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(address.id)}
                data-testid="address-item-delete"
                qa-data="address-item-delete"
                className="text-sm font-medium text-red-600 underline underline-offset-4"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={handleAdd}
        data-testid="address-form"
        qa-data="address-form"
        className="mt-8 flex max-w-md flex-col gap-3"
      >
        <h2 className="text-lg font-semibold">Add an address</h2>
        <p className="-mt-2 text-xs text-zinc-500">
          <RequiredMark /> Required
        </p>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-500">
            Label
            <RequiredMark />
          </span>
          <input
            placeholder="e.g. Home"
            required
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            data-testid="address-form-label"
            qa-data="address-form-label"
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-500">
            Street
            <RequiredMark />
          </span>
          <input
            required
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
            data-testid="address-form-street"
            qa-data="address-form-street"
            className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
          />
        </label>
        <div className="flex gap-3">
          <label className="flex w-1/2 flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-500">
              City
              <RequiredMark />
            </span>
            <input
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              data-testid="address-form-city"
              qa-data="address-form-city"
              className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
            />
          </label>
          <label className="flex w-1/2 flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-500">
              State
              <RequiredMark />
            </span>
            <input
              required
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              data-testid="address-form-state"
              qa-data="address-form-state"
              className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
            />
          </label>
        </div>
        <div className="flex gap-3">
          <label className="flex w-1/2 flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-500">
              ZIP
              <RequiredMark />
            </span>
            <input
              required
              value={form.zip}
              onChange={(e) => setForm({ ...form, zip: e.target.value })}
              data-testid="address-form-zip"
              qa-data="address-form-zip"
              className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
            />
          </label>
          <label className="flex w-1/2 flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-500">
              Country
              <RequiredMark />
            </span>
            <input
              required
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              data-testid="address-form-country"
              qa-data="address-form-country"
              className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
            />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
            data-testid="address-form-is-default"
            qa-data="address-form-is-default"
          />
          Set as default
        </label>

        {error && (
          <p
            data-testid="address-form-error"
            qa-data="address-form-error"
            className="text-sm text-red-600"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          data-testid="address-form-submit"
          qa-data="address-form-submit"
          className="mt-2 self-start rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : "Save address"}
        </button>
      </form>
    </div>
  );
}
