"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation"; // Import useSearchParams
import React from "react"; // Import React for Fragment

// Define props type for clarity
type BreadcrumbsProps = {
  hideId?: boolean;
};

export function Breadcrumbs({ hideId = false }: BreadcrumbsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams(); // Get search params

  // Determine if IDs should be hidden based on prop or search param 'hideId=true'
  const effectiveHideId = hideId || searchParams.get("hideId") === "true";

  // Skip rendering breadcrumbs on homepage
  if (pathname === "/") return null;

  // Split path into segments and filter out empty ones
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  // Build up paths and display names for each segment
  const breadcrumbItems = pathSegments.map((segment, index) => {
    // Check if segment is likely an ID (UUID or numeric)
    const isLikelyId = /^[0-9a-f]{8,}-[0-9a-f-]{27,}$|^\d+$/.test(segment);

    // Construct the path for the link. If hiding IDs, ID segments link to their parent.
    let path;
    if (effectiveHideId && isLikelyId) {
      // Link points to the path *before* the ID segment
      path = "/" + pathSegments.slice(0, index).join("/");
    } else {
      // Link points to the path including the current segment
      path = "/" + pathSegments.slice(0, index + 1).join("/");
    }
    // Ensure root path is represented correctly (e.g., if path was just "/<id>")
    if (path === "") path = "/";

    const isLastItem = index === pathSegments.length - 1;

    // Format segment for display (capitalize, replace hyphens)
    const displayName = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    // If it's an ID and we are hiding IDs, replace display name with "Details"
    const finalDisplayName =
      effectiveHideId && isLikelyId ? "Details" : displayName;

    return {
      path, // The URL this breadcrumb segment links to
      rawSegment: segment, // Keep original segment for key generation
      displayName: finalDisplayName,
      isLastItem,
      isId: isLikelyId,
    };
  });

  // Filter out intermediate ID segments from breadcrumbs if effectiveHideId is true
  const filteredBreadcrumbItems = effectiveHideId
    ? breadcrumbItems.filter((item, index) => {
        // Always keep the last item, even if it's an ID (it shows as "Details")
        if (item.isLastItem) return true;
        // Hide intermediate items that are IDs
        return !item.isId;
      })
    : breadcrumbItems;

  return (
    <Breadcrumb className="my-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Render the filtered breadcrumb items */}
        {filteredBreadcrumbItems.map((item, index) => (
          // Use React.Fragment and a key combining segment and index for stability
          <React.Fragment key={`${item.rawSegment}-${index}`}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.isLastItem ? (
                // Last item is displayed as plain text (current page)
                <BreadcrumbPage>{item.displayName}</BreadcrumbPage>
              ) : (
                // Intermediate items are links
                // Pass effectiveHideId to BreadcrumbLink so it can adjust the href if needed
                <BreadcrumbLink asChild hideId={effectiveHideId}>
                  <Link href={item.path}>{item.displayName}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
