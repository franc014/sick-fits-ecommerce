import { PAGINATION_QUERY } from "../components/Pagination";

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we will take care of everything
    read(existing = [], { args, cache }) {
      // console.log({ existing, args, cache });
      const { skip, take } = args;

      console.log({ skip, take });

      // Read the number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?.productsCount;
      const page = skip / take + 1;
      const pages = Math.ceil(count / take);

      // Check if we have existing items
      const items = existing.slice(skip, skip + take).filter((x) => x);
      // If
      // There are items
      // AND there aren't enough items to satisfy how many were requested
      // AND we are on the last page
      // THEN JUST SEND IT

      if (items.length && items.length !== take && page === pages) {
        return items;
      }
      if (items.length !== take) {
        // We don't have any items, we must go to the network to fetch them
        return false;
      }

      // If there are items, just reutrn them from the cache, and we don't need to go to the network
      if (items.length) {
        // console.log(
        //   `There are ${items.length} items in the cache! Gonna send them to apollo`
        // );
        return items;
      }

      return false; // fallback to network

      // First thing it does it asks the read function for those items.
      // We can either do one of two things:
      // First things we can do is return the items because they are already in the cache
      // The other thing we can do is to return false from here, (network request)
    },
    merge(existing, incoming, { args }) {
      const { skip, take } = args;
      // This runs when the Apollo client comes back from the network with our product
      // console.log(`MErging items from the network ${incoming.length}`);
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      // console.log(merged);
      // Finally we return the merged items from the cache,
      return merged;
    },
  };
}
