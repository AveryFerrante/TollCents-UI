import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import type { PlaceSuggestionResult } from "../../models/place-suggestion-result";
import {
  accessCodeStorage,
  PreviousSearchedAddressesStorage,
} from "../../services/local-storage-service";
import AccessCodePrompt from "./access-code-prompt";
import AutoCompleteAddressInput from "./auto-complete-address-input";

const HeaderWordEmphasis = styled("span")(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const validateInput = (
  startAddress: PlaceSuggestionResult | null,
  endAddress: PlaceSuggestionResult | null
) => {
  return startAddress?.name && endAddress?.name;
};

// const getPreviouslySearchedAddresses = (
//   type: "start" | "end"
// ): PlaceSuggestionResult[] => {
//   const previousAddresses = PreviousSearchedAddressesStorage.get();
//   const addresses =
//     type === "start"
//       ? previousAddresses?.startAddresses
//       : previousAddresses?.endAddresses;
//   if (!previousAddresses || !Array.isArray(addresses)) return [];
//   return addresses
//     .slice()
//     .sort((a, b) => b.count - a.count)
//     .slice(0, 3)
//     .map((addr) => {
//       return { name: addr.address };
//     });
// };

const setSearchedAddress = (type: "start" | "end", address: string) => {
  if (!address || address.length === 0) return;
  const previousAddresses = PreviousSearchedAddressesStorage.get() ?? {
    startAddresses: [],
    endAddresses: [],
  };
  const workingList =
    type === "start"
      ? previousAddresses.startAddresses
      : previousAddresses.endAddresses;
  const existing = workingList.find((a) => a.address === address);
  if (existing) {
    existing.count += 1;
  } else {
    workingList.push({ address, count: 1 });
  }
  PreviousSearchedAddressesStorage.set(previousAddresses);
};

const SearchForm = () => {
  const navigate = useNavigate();
  const [startLocation, setStartLocation] =
    useState<PlaceSuggestionResult | null>(null);
  const [endLocation, setEndLocation] = useState<PlaceSuggestionResult | null>(
    null
  );
  const [accessCode, setAccessCode] = useState(accessCodeStorage.get() ?? "");
  const [hasTollTag, setHasTollTag] = useState(false);

  const handleButtonClick = () => {
    const queryParams = new URLSearchParams({
      start: startLocation!.name,
      end: endLocation!.name,
      hasTollTag: hasTollTag.toString(),
    });
    navigate(`/routes?${queryParams.toString()}`);
  };

  const handleSetLocation = (
    type: "start" | "end",
    value: PlaceSuggestionResult | null
  ) => {
    setSearchedAddress(type, value?.name ?? "");
    if (type === "start") {
      setStartLocation(value);
    } else {
      setEndLocation(value);
    }
  };

  const isFormValid = validateInput(startLocation, endLocation);

  return (
    <Stack alignItems="center" spacing={6}>
      <Stack spacing={0}>
        <Typography variant="h2" fontWeight="bold" textAlign="center">
          Have Some <HeaderWordEmphasis>TollCents</HeaderWordEmphasis>
        </Typography>
        <Typography variant="body1" textAlign="center">
          Plan your trip with accurate drive times and toll costs
        </Typography>
      </Stack>
      {!accessCode || accessCode.length === 0 ? (
        <AccessCodePrompt onAccessCodeSet={setAccessCode} />
      ) : (
        <Card
          sx={{ width: "100%", maxWidth: "780px", py: 2, px: 1 }}
          elevation={3}
        >
          <CardHeader
            title="Enter Your Route"
            subheader="Provide your starting point and destination to get detailed trip information"
          />

          <CardContent>
            <Stack spacing={2}>
              <AutoCompleteAddressInput
                placeholder="Start address"
                onValueSelect={(location) =>
                  handleSetLocation("start", location)
                }
                iconColor="success"
                accessCode={accessCode}
                // previousSearches={getPreviouslySearchedAddresses("start")}
              />
              <AutoCompleteAddressInput
                placeholder="Destination address"
                onValueSelect={(location) => handleSetLocation("end", location)}
                iconColor="error"
                accessCode={accessCode}
                // previousSearches={getPreviouslySearchedAddresses("end")}
              />
              <FormControlLabel
                sx={{ width: "fit-content" }}
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography>I have a TX toll tag </Typography>
                    <img
                      src="https://www.ntta.org/themes/custom/ntta/images/tolltag-logo.svg"
                      width={20}
                      height={20}
                    />
                  </Stack>
                }
                control={
                  <Checkbox
                    sx={{ p: "0 8px 0 0" }}
                    checked={hasTollTag}
                    onChange={(e) => setHasTollTag(e.target.checked)}
                  />
                }
              />
            </Stack>
          </CardContent>
          <CardActions>
            <Stack spacing={0} width="100%">
              <Button
                fullWidth
                variant="contained"
                disabled={!isFormValid}
                onClick={handleButtonClick}
              >
                Calculate Options
              </Button>
              <Typography
                variant="caption"
                sx={{ display: isFormValid ? "none" : "block" }}
              >
                *Please supply info for all fields
              </Typography>
            </Stack>
          </CardActions>
        </Card>
      )}
    </Stack>
  );
};

export default SearchForm;
