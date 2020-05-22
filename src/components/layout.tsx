import Head from "next/head";
import Link from "next/link";

import {
  Heading,
  Box,
  Button,
  Image,
  Flex,
  Text,
  Link as LinkRebass,
} from "rebass";
import { MenuButton } from "theme-ui";

const name = "Awesome App Name";
export const siteTitle = "Next.js Sample Website";

export default function Layout({
  children,
  home,
}: {
  children: React.ReactNode;
  home?: boolean;
}) {
  return (
    <>
      <Flex px={2} alignItems="center" color="background" bg="text">
        <Text p={2} fontWeight="bold">
          {name}
        </Text>
        <Box mx="auto" />
        <Link href="#!">
          <MenuButton aria-label="Toggle Menu" />
        </Link>
      </Flex>
      <Box
        sx={{
          p: 4,
          color: "text",
          bg: "background",
          fontFamily: "body",
          fontWeight: "body",
          lineHeight: "body",
        }}
      >
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Learn how to build a personal website using Next.js"
          />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <main>{children}</main>
        {!home && (
          <Box>
            <Link href="/">
              <Button>← Back to home</Button>
            </Link>
          </Box>
        )}
      </Box>
    </>
  );
}
