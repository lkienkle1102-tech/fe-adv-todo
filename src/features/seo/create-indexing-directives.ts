import type { Metadata } from "next"

type IndexingDirectiveOptions = {
  index?: boolean
  follow?: boolean
  archive?: boolean
  imageIndex?: boolean
  snippetLength?: number
}

export function createIndexingDirectives({
  index = true,
  follow = true,
  archive = true,
  imageIndex = true,
  snippetLength = -1,
}: IndexingDirectiveOptions = {}): Metadata["robots"] {
  return {
    index,
    follow,
    noarchive: !archive,
    googleBot: {
      index,
      follow,
      noimageindex: !imageIndex,
      "max-image-preview": "large",
      "max-snippet": snippetLength,
      "max-video-preview": -1,
    },
  }
}
