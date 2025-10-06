import { Close, MyLocation, Restore } from "@mui/icons-material";
import RoomIcon from "@mui/icons-material/Room";
import {
  Autocomplete,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
  Typography,
  type PaperProps,
  type SvgIconOwnProps,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import useIsMobile from "../../hooks/useIsMobile";
import type { PlaceSuggestionResult } from "../../models/place-suggestion-result";
import {
  fetchAddressFromGeolocation,
  fetchAddressSuggestions,
} from "../../services/api-service";

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
  canUseCurrentLocation?: boolean;
};
const AutoCompleteAddressInput = ({
  placeholder,
  onValueSelect,
  iconColor,
  accessCode,
  previousSearches,
  canUseCurrentLocation = false,
}: AutoCompleteInputProps) => {
  const [selectedValue, setSelectedValue] =
    useState<PlaceSuggestionResult | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<PlaceSuggestionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTextFieldActive, setIsTextFieldActive] = useState(false);
  const [errorText, setErrorText] = useState("");
  const isMobile = useIsMobile();
  const ignoreNextInputValueChange = useRef(false);

  const handleSetInputValue = (inputValue: string) => {
    if (inputValue.length < minimumQueryCharacterCount) {
      setIsLoading(false);
    }
    setInputValue(inputValue);
  };

  const handleMyLocationClick = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          try {
            const result = await fetchAddressFromGeolocation(
              latitude,
              longitude,
              accessCode
            );

            setSelectedValue(result);
            ignoreNextInputValueChange.current = true;
            onValueSelect(result);
          } catch (error) {
            // TODO: Proper error messaging
            alert(
              "Location cannot be determined, please fill out the search bar"
            );
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          // TODO: Proper error messaging
          setIsLoading(false);
          if (error.PERMISSION_DENIED) {
            alert("Permission to location denied");
          } else
            alert(
              "Location cannot be determined, please fill out the search bar"
            );
        },
        {
          enableHighAccuracy: true,
          timeout: 7500,
          maximumAge: 0,
        }
      );
    } else {
      alert("Geolocation is not supported by the browser");
    }
  };
  useEffect(() => {
    // TODO: clean up?
    if (inputValue === "" || inputValue.length < minimumQueryCharacterCount) {
      setOptions([]);
      return undefined;
    }

    if (ignoreNextInputValueChange.current) {
      ignoreNextInputValueChange.current = false;
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
      clearIcon={<Close />}
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
      loading={isLoading}
      value={selectedValue}
      onChange={(_, newValue) => {
        console.log("onChange triggered");
        onValueSelect(newValue);
        setSelectedValue(newValue);
        handleSetInputValue("");
      }}
      onInputChange={(_, newInputValue) => {
        console.log("onInputChange");
        handleSetInputValue(newInputValue);
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
              sx: {
                paddingRight: "1rem !important",
              },
              endAdornment: isLoading ? (
                <CircularProgress size={20} />
              ) : canUseCurrentLocation && isMobile ? (
                <IconButton onClick={handleMyLocationClick}>
                  <MyLocation color="primary" />
                </IconButton>
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
