# Full generated protobuf snapshot

This is the complete `gen/` tree as delivered, kept out of `gen/` so the
committed tree only carries what the SDK imports.

`gen/` currently holds 41 files, the transitive closure of everything
`clients/`, `managers/`, `types/` and `utils/` import. The other 321 files
are here.

## Restoring a file

Extract it back into place:

```bash
cd .gen-full && unzip -o gen-full.zip 'gen/cosmos/gov/v1/*' -d /tmp/restore
cp -r /tmp/restore/gen/cosmos/gov /path/to/inj-sdk/gen/cosmos/
```

Or restore everything, then re-prune:

```bash
cd .gen-full && unzip -o gen-full.zip -d /tmp/full
rm -rf ../gen && cp -r /tmp/full/gen ../gen
```

## Regenerating from proto source instead

`all_protos/` holds 357 `.proto` files and `buf.ts.yaml` points at it, so the
whole tree is reproducible:

```bash
bunx buf generate --template buf.ts.yaml
```

Note the delivered `gen/` was produced by protoc-gen-ts_proto v2.21.1, while
`package.json` pins v2.12.0. Regenerating will produce slightly different
output from the snapshot in the zip.
