import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useColorMode } from '@docusaurus/theme-common';
import { Grid } from '@mui/material';
import {
  FcCommandLine as CliIcon,
  FcNews as DefinitionIcon,
  FcUnlock as CommandForceIcon,
  FcGenealogy as SubcommandIcon,
  FcReading as AutoHelpIcon,
  FcSettings as ConfigurationIcon,
  FcIdea as ParserIcon,
  FcLink as CommandAliasIcon,
  FcDeployment as ShipIcon,
  FcBinoculars as CheckTypesIcon,
  FcFactory as GenerateIcon,
  FcAdvertising as AutoUpdateIcon,
  FcFlashOn as NoDependenciesIcon
} from 'react-icons/fc';

import versions from '../../versions.json'

const Header = () => (
  <header
    style={{
      margin: 0,
      padding: 0,
      backgroundColor: '#f3df43',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    }}
  >
    <div>
      <a
        href='https://github.com/matthewgetz/rotini'
        target='_blank'
      >
        <img
          src='https://i.imgur.com/on3MlUa.png'
          alt='rotini'
          style={{
            width: '100%',
            height: '100%',
            minHeight: 300,
            minWidth: 300,
            maxHeight: 500,
            maxWidth: 500,
            borderRadius: 10,
          }}
        />
      </a>
      <p
        style={{
          fontFamily: 'Poppins',
          fontWeight: 'bold',
          color: 'black',
          fontSize: 26,
          marginTop: -50,
          marginBottom: 70,
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        a framework for building node.js cli programs
      </p>
    </div>
  </header>
);

const Blurb = () => {
  const { colorMode } = useColorMode();

  return (
    <section style={{ paddingTop: 90, paddingBottom: 100, textAlign: 'center', backgroundColor: '#1b1b1d' }}>
      <div style={{ paddingLeft: 20, paddingRight: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ color: '#e3e3e3', fontSize: 50, maxWidth: 600, textAlign: 'left', lineHeight: 1, fontWeight: 'bold' }}>
            Write your CLI as <b className="text text--primary">config</b> not as <b className="text text--secondary">code</b>.
          </span>
          <CliIcon size={130} />
        </div>
      </div>
      <div style={{ maxWidth: 770, margin: 'auto', paddingTop: 20, paddingLeft: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Link className="button button--primary" to={`/docs/${versions[0]}`} style={{ width: 150, marginRight: 10, padding: 15, color: colorMode === 'dark' ? 'black' : 'white', fontSize: 20 }}>
            Get Started
          </Link>
          <Link className="button button--secondary" to="/blog" style={{ width: 150, marginLeft: 10, padding: 15, color: colorMode === 'dark' ? 'white' : 'black', fontSize: 20 }}>
            News
          </Link>
          <div style={{ flexGrow: 1 }} />
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const Feature = ({ Icon, title, info }) => (
    <div style={{ textAlign: 'center', marginTop: 50, marginBottom: 50, marginLeft: 50, marginRight: 50 }}>
      <Icon size={120} />
      <p style={{ fontSize: 18, fontWeight: 'bold' }}>{title}</p>
      <p style={{ fontSize: 16 }}>{info}</p>
    </div>
  );

  return (
    <section style={{ marginTop: 50, marginBottom: 10 }}>
      <h3 style={{ textAlign: 'center', fontSize: 40 }}>Features</h3>
      <Grid container style={{ maxWidth: 1400, margin: 'auto' }}>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Feature
            Icon={DefinitionIcon}
            title='Declarative Program Definitions'
            info='Define and describe your program commands, arguments, and flags. rotini will build your program and parse it; you only need to write code for your command operations.'
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Feature
            Icon={ParserIcon}
            title='Command, Argument, and Flag Parsing'
            info='rotini has a powerful and flexible parser. User input is checked against the program definition you write, and command operations are handed all parsed commands, arguments, and flags.'
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Feature
            Icon={SubcommandIcon}
            title='Subcommand Support'
            info='Nest commands under commands under commands under commands... Every command you define can have its own subcommands, bringing a declarative approach to program definitions.'
          />
        </Grid>
      </Grid>
      <Grid container style={{ maxWidth: 1400, margin: 'auto' }}>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Feature
            Icon={CommandAliasIcon}
            title='Command Aliases'
            info='In the event that you need to deprecate a command or want to move to a better suited command name, you can supply an alias for the command that the parser will match to your command during parsing. Each command can have multiple aliases to reduce breaking changes and to help with naming migrations.'
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Feature
            Icon={CommandForceIcon}
            title='Command Force Prompting'
            info='rotini will prompt users to confirm (Y/n) commands that have a "force" flag defined in their definition, which can be helpful as a guard against destructive actions. The prompt can be bypassed if the user passes the override flag, which may also be needed in CI environments.'
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Feature
            Icon={CheckTypesIcon}
            title='Value Validation'
            info='rotini argument and flag definitions can specify a type, which the parser will respect; mismatched value types passed to your program will report errors. Additionally, arguments and flags can have defined allowed values and are each provided with a callback for you to write additional validation for your argument and flag parsing.'
          />
        </Grid>
      </Grid>
      <Grid container style={{ maxWidth: 1400, margin: 'auto' }}>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Feature
            Icon={GenerateIcon}
            title='Generate CLI'
            info='Generate a rotini CLI program for JavaScript or TypeScript and start building immediately. A single command - npx rotini generate my-cli - will get you started.'
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Feature
            Icon={AutoUpdateIcon}
            title='Auto-Update Support'
            info='Once published, rotini can check to see when new versions of your CLI are published and will prompt users to update to the latest version.'
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Feature
            Icon={NoDependenciesIcon}
            title='Dependency Free'
            info='rotini does not have any dependencies. Keeping the bundle size small helps to keep rotini fast at installing, building, and parsing.'
          />
        </Grid>
      </Grid>
      <Grid container style={{ maxWidth: 1400, margin: 'auto' }}>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Feature
            Icon={AutoHelpIcon}
            title='Auto-Generated Help Output'
            info='Program and Command help output is built from the definition you provide to rotini. When a help flag is passed or when a command syntax is incorrect, rotini will output the corresponding help.'
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Feature
            Icon={ConfigurationIcon}
            title='Configuration File Support'
            info='rotini returns helper functions for writing and reading a configuration file (json/txt) for your program when a configuration directory and file defined in the program definition.'
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Feature
            Icon={ShipIcon}
            title='Ship Faster'
            info='rotini is a highly-opinionated framework that allows you to focus on your program code without needing to manage how your program is built or parsed. Add new commands quickly, deploy new functionality faster.'
          />
        </Grid>
      </Grid>
    </section>
  );
};

const Home = () => {
  const { siteConfig: { tagline }, } = useDocusaurusContext();

  return (
    <Layout title={tagline} noFooter>
      <Header />
      <main>
        <Blurb />
        <Features />
      </main>
    </Layout>
  );
};

export default Home;
