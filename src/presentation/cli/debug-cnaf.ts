import {Command} from 'commander';
import {CnafInput} from 'src/domain/data-fetching/data-providers/cnaf/dto';
import {
  buildQuery,
  SoapDataProvider,
} from 'src/infrastructure/data-providers/cnaf/soap';

(async () => {
  const program = new Command();
  program
    .name('debug-cnaf')
    .description(
      'Calls the CNAF SOAP endpoint and prints out the input and output XML to help the CNAF developpers understand their API behavior.'
    )
    .version('0.0.1')
    .requiredOption(
      '-a --allocataire [allocataire]',
      "Numéro d'allocataire CNAF"
    )
    .requiredOption('-c --code-postal [codePostal]', 'Code postal')
    .parse(process.argv);

  const {allocataire, codePostal} = program.opts();

  const cnafInput: CnafInput = {
    codePostal,
    numeroAllocataire: allocataire,
  };

  const soapdataProvider = new SoapDataProvider();

  const inputXml = buildQuery(cnafInput);

  console.log('Input XML');
  console.log(inputXml);

  const outputXml = await soapdataProvider.fetchXmlResponse(cnafInput);

  console.log('Output XML');
  console.log(outputXml);
})();
