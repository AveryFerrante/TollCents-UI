import RoomIcon from "@mui/icons-material/Room";
import {
  Autocomplete,
  CircularProgress,
  Paper,
  TextField,
  type PaperProps,
  type SvgIconOwnProps,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { PlaceSuggestionResult } from "../../models/place-suggestion-result";
import { fetchAddressSuggestions } from "../../services/api-service";

const CustomMenu = (props: PaperProps) => {
  return (
    <Paper
      {...props}
      elevation={8}
      sx={{ ...props.sx, backgroundColor: "primary.disabled" }}
    >
      {props.children}
    </Paper>
  );
};

const minimumQueryCharacterCount = 3;
type AutoCompleteInputProps = {
  placeholder: string;
  onValueSelect: (value: PlaceSuggestionResult | null) => void;
  iconColor: SvgIconOwnProps["color"];
  accessCode: string;
  // previousSearches: PlaceSuggestionResult[];
};
const AutoCompleteAddressInput = ({
  placeholder,
  onValueSelect,
  iconColor,
  accessCode,
}: // previousSearches,
AutoCompleteInputProps) => {
  const [selectedValue, setSelectedValue] =
    useState<PlaceSuggestionResult | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<PlaceSuggestionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    // TODO: clean up?
    if (inputValue === "" || inputValue.length < minimumQueryCharacterCount) {
      setOptions([]);
      setHasFetched(false);
      return undefined;
    }

    let active = true;
    const debounced = setTimeout(async () => {
      setIsLoading(true);
      const response = await fetchAddressSuggestions(inputValue, accessCode);
      if (active) {
        setOptions(response);
        setIsLoading(false);
        setHasFetched(true);
      }
    }, 750);
    return () => {
      active = false;
      clearTimeout(debounced);
    };
  }, [inputValue, accessCode]);

  // TODO: Better handling of showing previous searches vs. API results vs. No results, etc.
  // If inputValue is empty, show previous searches? This means that "Type at least X characters" won't show.
  // Check for first interaction - if no interaction, show previous searches?
  // If interaction but no results, show "No results found"
  // If interaction and results, show results
  // If interaction and loading, show loading
  // hasFetched is always the inverse of isLoading?, except when inputValue is empty [after the comma was AI input]?
  return (
    <Autocomplete
      options={
        // options && options.length > 0 && inputValue.length > 0
        //   ? options
        //   : previousSearches
        options
      }
      getOptionLabel={(option) => option.name}
      filterOptions={(x) => x}
      autoComplete
      filterSelectedOptions
      includeInputInList
      slots={{
        paper: CustomMenu,
      }}
      // renderOption={(props, option) => {
      //   const isPrevious = previousSearches?.some(
      //     (p) => p.name === option.name
      //   );
      //   return (
      //     <li {...props}>
      //       {option.name}
      //       {isPrevious ? (
      //         <span style={{ marginLeft: 8, fontSize: "0.8em", opacity: 0.8 }}>
      //           *previous search
      //         </span>
      //       ) : null}
      //     </li>
      //   );
      // }}
      noOptionsText={
        inputValue.length < minimumQueryCharacterCount
          ? `Type at least ${minimumQueryCharacterCount} characters`
          : hasFetched && !isLoading && options.length === 0
          ? "No results found"
          : "Loading..."
      }
      loading={isLoading}
      value={selectedValue}
      onChange={(_, newValue) => {
        onValueSelect(newValue);
        setSelectedValue(newValue);
        setInputValue("");
      }}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          placeholder={placeholder}
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: <RoomIcon color={iconColor} sx={{ mr: 2 }} />,
              endAdornment: isLoading ? <CircularProgress size={20} /> : <></>,
            },
          }}
        />
      )}
    />
  );
};

export default AutoCompleteAddressInput;
