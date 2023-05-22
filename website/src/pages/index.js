import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useColorMode } from '@docusaurus/theme-common';
import { Grid } from '@mui/material';
import { SiNodedotjs as NodejsIcon, SiTypescript as TypescriptIcon } from 'react-icons/si'
import { DiNpm as NpmIcon } from 'react-icons/di'
import { BsFlagFill as FlagIcon } from 'react-icons/bs'
import {
  FcCommandLine as CliIcon,
  FcNews as DefinitionIcon,
  FcUnlock as CommandForceIcon,
  FcGenealogy as SubcommandIcon,
  FcReading as AutoHelpIcon,
  FcSettings as ConfigurationIcon,
  FcIdea as ParserIcon,
  FcLink as CommandAliasIcon,
  FcDeployment as DeployIcon,
  FcInTransit as ShipIcon,
  FcBinoculars as TypedIcon,
  FcAdvertising as AutoUpdateIcon,
  FcFlashOn as NoDependenciesIcon,
  FcApproval as ValueValidationIcon,
  FcElectricity as ValueParserIcon,
  FcSerialTasks as OperationsIcon
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
          <div style={{ width: 120, height: 120 }}>
            <DeployIcon size={120} />
          </div>
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
  const FcIcon = ({ Icon }) => <Icon size={120} />;
  const BsIcon = ({ Icon, size, color }) => <Icon style={{ width: size, height: size, color, }} />

  const ColorFeature = ({ Icon, title, info }) => (
    <div style={{ textAlign: 'center', marginTop: 50, marginBottom: 50, marginLeft: 50, marginRight: 50 }}>
      <FcIcon Icon={Icon} />
      <p style={{ fontSize: 18, fontWeight: 'bold' }}>{title}</p>
      <p style={{ fontSize: 16 }}>{info}</p>
    </div>
  );

  const AwesomeFeature = ({ Icon, title, info, size, color }) => (
    <div style={{ textAlign: 'center', marginTop: 50, marginBottom: 50, marginLeft: 50, marginRight: 50 }}>
      <BsIcon Icon={Icon} size={size} color={color} />
      <p style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>{title}</p>
      <p style={{ fontSize: 16 }}>{info}</p>
    </div>
  );

  return (
    <section style={{ marginTop: 50, marginBottom: 10 }}>
      <h3 style={{ textAlign: 'center', fontSize: 40 }}>Features</h3>
      <Grid container style={{ maxWidth: 1400, margin: 'auto' }}>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <ColorFeature
            Icon={DefinitionIcon}
            title='Declarative Program Definitions'
            info='Define your program commands, arguments, and flags. Rotini will build your program and parse it; you only need to write code for your command operation handlers.'
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <ColorFeature
            Icon={ParserIcon}
            title='Command, Argument, and Flag Parsing'
            info='Rotini has a powerful and configurable parser. User input is checked against the program definition you provide, and command operations are handed all parsed commands, arguments, and flags.'
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <ColorFeature
            Icon={SubcommandIcon}
            title='Subcommand Support'
            info='Nest commands under commands under commands under commands... Every command you define can have its own subcommands, bringing a declarative approach to program definitions.'
          />
        </Grid>
      </Grid>
      <Grid container style={{ maxWidth: 1400, margin: 'auto' }}>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <ColorFeature
            Icon={CommandAliasIcon}
            title='Command Aliases'
            info='In the event that you need to deprecate a command or want to move to a better suited command name, you can supply an alias for the command that the parser will match to your command during parsing. Each command can have multiple aliases to reduce breaking changes and to help with naming migrations.'
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <ColorFeature
            Icon={CommandForceIcon}
            title='Command Confirmation Prompting'
            info='Rotini will prompt users to confirm (Y/n) commands that have a "force" flag defined in their definition, which can be helpful as a guard against destructive actions. The prompt can be bypassed if the user passes the override flag, which may also be needed in CI/CD environments.'
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <ColorFeature
            Icon={TypedIcon}
            title='Typed Values'
            info='Rotini argument and flag definitions can specify a type, which the parser will respect. Mismatched value types passed to your program will report errors. Additionally, arguments and flags can have defined allowed values and are each provided with a callback for you to write additional validation for your argument and flag parsing.'
          />
        </Grid>
      </Grid>
      <Grid container style={{ maxWidth: 1400, margin: 'auto' }}>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <ColorFeature
            Icon={ValueValidationIcon}
            title='Value Validators'
            info='Each argument and flag has a validator function that can be used to apply additional validation in addition to specifying the value type or known values. Maybe you only want strings of a certain length, or numbers under a certain value - this function provides additional validation behavior control.'
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <ColorFeature
            Icon={OperationsIcon}
            title='Command Operation Handlers'
            info='Each rotini command has multiple operation handlers - a beforeHandler, handler, afterHandler, onHandlerSuccess, onHandlerFailure, and onHandlerTimeout function. Only a handler needs to be defined for a command to have an operation, but the other functions can help to control the process flow of your command.'
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <ColorFeature
            Icon={ValueParserIcon}
            title='Value Parsers'
            info='Each argument and flag has a parser function that can be used to override the parsing that rotini provides. Maybe you want to silently swap any number over a certain value to a known high value, or consistently append to the end of a string - this function provides additional parse behavior control.'
          />
        </Grid>
      </Grid>
      <Grid container style={{ maxWidth: 1400, margin: 'auto' }}>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <ColorFeature
            Icon={AutoHelpIcon}
            title='Auto-Generated Help Output'
            info='Program and Command help output is built from the definition you provide to rotini. When a help flag is passed or when a command syntax is incorrect, rotini will output the corresponding help.'
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <ColorFeature
            Icon={ConfigurationIcon}
            title='Configuration File Support'
            info='Rotini returns helper functions for writing and reading a configuration files for your program that are handed to each command operation handler.'
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <ColorFeature
            Icon={AutoUpdateIcon}
            title='Auto-Update Support'
            info='Once published, rotini can check to see when new versions of your CLI are published to a registry and will prompt users to update to the latest version.'
          />
        </Grid>
      </Grid>
      <Grid container style={{ maxWidth: 1400, margin: 'auto' }}>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <AwesomeFeature
            Icon={FlagIcon}
            title='Positional Flags'
            info='Positional flags are flags that occur as the first parameter passed to your cli program. They differ from global and local flags in that they have an operation handler. When a positional argument is found, flag values will be parsed and handed to the operation.'
            size={92}
            color='#f3df43'
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <AwesomeFeature
            Icon={FlagIcon}
            title='Global Flags'
            info='Global flags exist for every command. If you have a flag that is repeated across all commands, you can define it as a global flag and it will be parsed and provided to any command operation.'
            size={92}
            color='#000000'
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <AwesomeFeature
            Icon={FlagIcon}
            title='Local Flags'
            info='Local flags are localized to the command where they are defined and will be found in the resulting command parse object. A local flag might be used over a command argument when it is modifying the behavior of the command.'
            size={92}
            color='#ca0101'
          />
        </Grid>
      </Grid>
      <Grid container style={{ maxWidth: 1400, margin: 'auto' }}>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <ColorFeature
            Icon={CliIcon}
            title='Shell Autocomplete'
            info='Shell autocomplete (bash/zsh) is generated for every program created with rotini. (coming soon)'
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <ColorFeature
            Icon={NoDependenciesIcon}
            title='Dependency Free'
            info='Rotini does not have any dependencies. Keeping the bundle size small helps to keep rotini fast at installing, building, and parsing.'
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <ColorFeature
            Icon={ShipIcon}
            title='Ship Faster'
            info='Rotini is a highly-opinionated framework that allows you to focus on your program code without needing to manage how your program is built or parsed.'
          />
        </Grid>
      </Grid>
    </section>
  );
};

const Footer = () => (
  <footer
    style={{
      backgroundColor: '#f3df43',
      paddingLeft: 20,
      paddingRight: 20,
    }}
  >
    <div style={{ width: '100%', maxWidth: 1600, margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
        <Link to='/' style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: 'bold', color: 'black', textDecoration: 'none' }}>rotini</Link>
        <div style={{ flexGrow: 1 }} />
        <p style={{ fontFamily: 'Poppins', fontSize: 12, color: 'black', marginTop: 20, paddingTop: 2 }}>Built with Docusaurus</p>
        <div style={{ flexGrow: 1 }} />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
          <NodejsIcon size={20} style={{ color: '#539e43', marginRight: 10, }} />
          <TypescriptIcon size={20} style={{ color: '#2d79c7', background: 'white' }} />
          <div style={{ background: 'white', height: 20, width: 42, marginLeft: 10, borderRadius: 4, }}>
            <a href='https://www.npmjs.com/package/rotini' target='_blank' referrerpolicy='no-referrer'>
              <NpmIcon size={40} style={{ color: '#c51010', marginTop: -10, paddingLeft: 3, paddingRight: 1 }} />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
)

const Home = () => {
  const { siteConfig: { tagline }, } = useDocusaurusContext();

  return (
    <Layout title={tagline} noFooter>
      <Header />
      <main>
        <Blurb />
        <Features />
      </main>
      <Footer/>
    </Layout>
  );
};

export default Home;
