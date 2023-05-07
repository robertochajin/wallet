import { useCallback, useState } from "react";
import keyring from "@polkadot/ui-keyring";
import { Button, Card, Elevation, Intent } from "@blueprintjs/core";
import DialogImportAddress from "../dialogs/DialogImportAddress";
import DialogCreateAddress from "../dialogs/DialogCreateAddress";
import Account from "./Account.client";
import useToaster from "../../hooks/useToaster";
import { useAccounts, useApi } from "../Api";

export default function Wallet() {
  const toaster = useToaster();

  const api = useApi();
  const accounts = useAccounts();

  const dialogsInitial = {
    seed_phrase: false,
    json: false,
    create: false,
  };
  const [dialogs, setDialogs] = useState(dialogsInitial);
  const dialogToggle = useCallback((name: keyof typeof dialogsInitial) => {
    setDialogs((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  const handleSeedPhraseImportClick = useCallback(
    (seed_phrase: string, password: string) => {
      try {
        const currentPairs = keyring.getPairs();
        const result = keyring.addUri(seed_phrase, password);
        if (currentPairs.some((keyringAddress) => keyringAddress.address === result.pair.address)) {
          toaster.show({
            icon: "warning-sign",
            intent: Intent.WARNING,
            message: "Wallet already imported",
          });
        }
        dialogToggle("seed_phrase");
      } catch (e: any) {
        toaster.show({
          icon: "ban-circle",
          intent: Intent.DANGER,
          message: e.message,
        });
      }
    },
    [dialogToggle, toaster]
  );

  const handleJSONWalletImportClick = useCallback(
    (json: string) => {
      try {
        const pair = keyring.createFromJson(JSON.parse(json));
        keyring.addPair(pair, "");
        dialogToggle("json");
      } catch (e: any) {
        toaster.show({
          icon: "ban-circle",
          intent: Intent.DANGER,
          message: e.message,
        });
      }
    },
    [dialogToggle, toaster]
  );

  if (!api) {
    return <div className="mb-4 w-100 h-[100px] border border-gray-500 border-dashed" />;
  }

  return (
    <div className="mb-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <DialogImportAddress
        isOpen={dialogs.seed_phrase}
        showPassword={true}
        onClose={() => dialogToggle("seed_phrase")}
        onImport={handleSeedPhraseImportClick}
      />
      <DialogImportAddress isOpen={dialogs.json} showPassword={false} onClose={() => dialogToggle("json")} onImport={handleJSONWalletImportClick} />
      <DialogCreateAddress isOpen={dialogs.create} onClose={() => dialogToggle("create")} />
      {accounts.map((pair) => {
        return <Account key={pair.address} pair={pair} />;
      })}
      <Card className="grid gap-1" elevation={Elevation.ZERO}>
        <Button icon="new-object" text="Create new address..." onClick={() => dialogToggle("create")} />
        <Button icon="add" text="Import from seed phrase..." onClick={() => dialogToggle("seed_phrase")} />
        <Button icon="import" text="Import from JSON..." onClick={() => dialogToggle("json")} />
      </Card>
    </div>
  );
}
