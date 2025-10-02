import { Restore } from "@mui/icons-material";
import RoomIcon from "@mui/icons-material/Room";
import {
  Autocomplete,
  Chip,
  CircularProgress,
  Paper,
  TextField,
  Typography,
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
  previousSearches: PlaceSuggestionResult[];
};
const AutoCompleteAddressInput = ({
  placeholder,
  onValueSelect,
  iconColor,
  accessCode,
  previousSearches,
}: // previousSearches,
AutoCompleteInputProps) => {
  const [selectedValue, setSelectedValue] =
    useState<PlaceSuggestionResult | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<PlaceSuggestionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [isTextFieldActive, setIsTextFieldActive] = useState(false);
  const [errorText, setErrorText] = useState("");

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
      try {
        const response = await fetchAddressSuggestions(inputValue, accessCode);
        if (active) {
          setOptions(response);
          setErrorText("");
        }
      } catch {
        if (active) {
          setErrorText("An unknown error occured");
          setOptions([]);
        }
      } finally {
        if (active) {
          setIsLoading(false);
          setHasFetched(true);
        }
      }
    }, 750);
    return () => {
      active = false;
      clearTimeout(debounced);
    };
  }, [inputValue, accessCode]);

  const inputHasMetMinCountThreshold =
    inputValue.length >= minimumQueryCharacterCount;
  const minCharacterHelpText = `Type at least ${minimumQueryCharacterCount} characters`;
  const showPreviousSearchedOptions = !(
    options.length > 0 && inputValue.length > 0
  );
  return (
    <Autocomplete
      options={showPreviousSearchedOptions ? previousSearches : options}
      getOptionLabel={(option) => option.name}
      filterOptions={(x) => x}
      autoComplete
      filterSelectedOptions
      includeInputInList
      slots={{
        paper: CustomMenu,
      }}
      renderOption={(props, option) => {
        return (
          <li {...props} key={props.key}>
            {option.name}
            {showPreviousSearchedOptions && (
              <Chip
                label="past search"
                size="small"
                variant="outlined"
                color="primary"
                icon={<Restore />}
                sx={{
                  ml: 2,
                }}
              />
            )}
          </li>
        );
      }}
      noOptionsText={
        errorText ? (
          <Typography color="error">{errorText}</Typography>
        ) : previousSearches.length === 0 && !inputHasMetMinCountThreshold ? (
          minCharacterHelpText
        ) : (
          "No Results Found"
        )
      }
      loadingText="Loading..."
      loading={isLoading && inputHasMetMinCountThreshold}
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
          onFocus={() => setIsTextFieldActive(true)}
          onBlur={() => {
            setIsTextFieldActive(false);
            setErrorText("");
          }}
          {...params}
          fullWidth
          placeholder={
            isTextFieldActive && previousSearches.length > 0
              ? minCharacterHelpText
              : placeholder
          }
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: <RoomIcon color={iconColor} sx={{ mr: 2 }} />,
              endAdornment:
                isLoading && inputHasMetMinCountThreshold ? (
                  <CircularProgress size={20} />
                ) : (
                  <></>
                ),
            },
          }}
        />
      )}
    />
  );
};

export default AutoCompleteAddressInput;
