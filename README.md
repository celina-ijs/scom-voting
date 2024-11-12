# Scom Voting Widget

The Scom Voting Widget is a component designed to facilitate voting functionality within your application.

## Features
- Easy integration with existing applications
- Customizable voting options
- Real-time vote counting and display

## Installation

### Step 1: Install packages
```sh
docker-compose up install
```

### Step 2: Build and bundle library
```sh
docker-compose up build
```

## Running Tests

### Step 3: Install packages for testing
```sh
docker-compose up installTest
```

### Step 4: Build and bundle library for testing
```sh
docker-compose up test
```

## Accessing the Dev Server
Access the dev server via [http://127.0.0.1:8088/](http://127.0.0.1:8088/)

## Usage
To use the Scom Voting Widget in your project, import it and include it in your component as follows:

```tsx
render() {
    return (
        <i-panel>           
            <i-scom-voting
                id="scomVoting"
                onButtonClicked={this.onButtonClicked}
            />
        </i-panel>
    )
}
```