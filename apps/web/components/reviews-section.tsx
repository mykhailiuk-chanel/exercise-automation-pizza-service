"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ReviewDto } from "@pizza/shared-types";
import { useAuth } from "@/components/auth-provider";
import { RequiredMark } from "@/components/required-mark";
import { deleteReview, fetchReviews, submitReview } from "@/lib/reviews-client";

export function ReviewsSection({ slug }: { slug: string }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [reviews, setReviews] = useState<ReviewDto[] | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = () => {
    fetchReviews(slug).then((r) => {
      setReviews(r);
      const own = r.find((review) => review.isOwn);
      if (own) {
        setRating(own.rating);
        setComment(own.comment);
      }
    });
  };

  const refreshList = () => {
    fetchReviews(slug).then(setReviews);
  };

  useEffect(load, [slug]);

  const ownReview = reviews?.find((r) => r.isOwn) ?? null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await submitReview(slug, { rating, comment });
      setRating(5);
      setComment("");
      refreshList();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't submit review");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    await deleteReview(slug);
    setRating(5);
    setComment("");
    load();
  }

  if (reviews === null) {
    return (
      <p
        data-testid="reviews-loading"
        qa-data="reviews-loading"
        className="mt-4"
      >
        Loading reviews…
      </p>
    );
  }

  return (
    <div
      className="mt-10"
      data-testid="reviews-section"
      qa-data="reviews-section"
    >
      <h2 className="text-lg font-semibold">
        Reviews {reviews.length > 0 && `(${reviews.length})`}
      </h2>

      {reviews.length === 0 ? (
        <p
          data-testid="reviews-empty"
          qa-data="reviews-empty"
          className="mt-2 text-sm text-zinc-600 dark:text-zinc-400"
        >
          No reviews yet.
        </p>
      ) : (
        <ul
          data-testid="reviews-list"
          qa-data="reviews-list"
          className="mt-4 flex flex-col gap-4"
        >
          {reviews.map((review) => (
            <li
              key={review.id}
              data-testid="review-item"
              qa-data="review-item"
              className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{review.authorName}</span>
                <span
                  data-testid="review-item-rating"
                  qa-data="review-item-rating"
                >
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {review.comment}
              </p>
              {review.isOwn && (
                <button
                  type="button"
                  onClick={handleDelete}
                  data-testid="review-item-delete"
                  qa-data="review-item-delete"
                  className="mt-2 text-xs font-medium text-red-600 underline underline-offset-4"
                >
                  Delete my review
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {!isAuthLoading && user ? (
        <form
          onSubmit={handleSubmit}
          data-testid="review-form"
          qa-data="review-form"
          className="mt-6 flex max-w-md flex-col gap-3"
        >
          <h3 className="text-sm font-semibold">
            {ownReview ? "Edit your review" : "Write a review"}
          </h3>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-500">
              Rating
              <RequiredMark />
            </span>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              data-testid="review-form-rating"
              qa-data="review-form-rating"
              className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star{n === 1 ? "" : "s"}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-500">
              Comment
              <RequiredMark />
            </span>
            <textarea
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              data-testid="review-form-comment"
              qa-data="review-form-comment"
              rows={3}
              className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
            />
          </label>
          {error && (
            <p
              data-testid="review-form-error"
              qa-data="review-form-error"
              className="text-sm text-red-600"
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            data-testid="review-form-submit"
            qa-data="review-form-submit"
            className="self-start rounded-full bg-foreground px-6 py-2 text-sm font-medium text-background disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving…"
              : ownReview
                ? "Update review"
                : "Submit review"}
          </button>
        </form>
      ) : (
        !isAuthLoading && (
          <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
            <Link
              href="/account/login"
              className="font-medium underline underline-offset-4"
            >
              Log in
            </Link>{" "}
            to write a review.
          </p>
        )
      )}
    </div>
  );
}
