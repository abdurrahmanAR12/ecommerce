import React from 'react';
import Autosuggest from 'react-autosuggest';
import { MenuItem, Button } from "@material-ui/core"
import Link from "next/link"

const getSuggestionValue = suggestion => suggestion;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
    <MenuItem>
        {suggestion}
    </MenuItem>
);

export default class Example extends React.Component {
    constructor() {
        super();
        this.state = {
            value: "",
            suggestions: []
        };
    }
    componentDidMount(props) {
        this.setState({ value: this.props._key })
    }
    onChange = (event, { newValue }) => {
        // console.log(newValue)
        this.setState({
            value: newValue
        });
    };

    onSuggestionsFetchRequested = ({ value }) => {
        fetch(`/api/search/names?key=${value}`).then(res => res.json()).then(suggestions => {
            if (typeof suggestions == "string")
                return this.setState({
                    // ...this.state,
                    suggestions: [],
                });

            this.setState({
                // ...this.state,
                suggestions,
            });
        });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            // ...this.state,
            suggestions: [],
        });
    };

    render() {
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: 'Search here...',
            value,
            className: "rounded-lg w-full",
            onChange: this.onChange
        };
        return (
            <div className="flex">
                <Autosuggest containerProps={{
                    className: "w-full"
                }}
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                />
                <div className="ml-2">
                    {/* <a href={`/results?key=${value}`}> */}
                        <Button href={`/results?key=${value}`} variant='contained'>
                            Go
                        </Button>
                    {/* </a> */}
                </div>
            </div>
        );
    }
}