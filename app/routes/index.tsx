import NetworkState from "../components/NetworkState.client";
import Blocks from "../components/block/Blocks.client";
import { ClientOnly } from "remix-utils";

export default function Index() {
  return (
    <ClientOnly>
      {() => (
        <>
          <NetworkState />
          <Blocks />
        </>
      )}
    </ClientOnly>
  );
}