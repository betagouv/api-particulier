import {readFileSync} from 'fs';
import {XMLParser} from './parser';

describe('The CNAF XML parser', () => {
  it('parses the XML', () => {
    const parser = new XMLParser();
    const okXML = readFileSync(
      __dirname + '/__tests__/resources/ok.txt',
      'utf-8'
    );

    const result = parser.parse(okXML);

    expect(result).toMatchInlineSnapshot(`
"--MIMEBoundary_0085f52c3f26502144f16811fb6d6544e7f36e41757a5486
Content-Type: application/xop+xml; charset=utf-8; type=\\"text/xml\\"
Content-Transfer-Encoding: binary
Content-ID: <0.1085f52c3f26502144f16811fb6d6544e7f36e41757a5486@apache.org>

<?xml version=\\"1.0\\" encoding=\\"utf-8\\"?><soapenv:Envelope xmlns:soapenv=\\"http://schemas.xmlsoap.org/soap/envelope/\\"><soapenv:Body><ns2:demanderDocumentWebResponse xmlns:ns2=\\"http://v1.ws.wsdemandedocumentcafweb.cnaf/\\"><return><beanRetourDemandeDocumentWeb><codeRetour>0</codeRetour><fluxRetour>&lt;?xml version=\\"1.0\\" encoding=\\"UTF-8\\" standalone=\\"yes\\"?&gt;
&lt;drtData&gt;
    &lt;adresse&gt;
        &lt;LIBLIG1ADR&gt;Madame JEANNE CROUTE&lt;/LIBLIG1ADR&gt;
        &lt;LIBLIG2ADR&gt;&lt;/LIBLIG2ADR&gt;
        &lt;LIBLIG3ADR&gt;&lt;/LIBLIG3ADR&gt;
        &lt;LIBLIG4ADR&gt;23 RUE DES ROSIERS&lt;/LIBLIG4ADR&gt;
        &lt;LIBLIG5ADR&gt;&lt;/LIBLIG5ADR&gt;
        &lt;LIBLIG6ADR&gt;75002 PARIS&lt;/LIBLIG6ADR&gt;
        &lt;LIBLIG7ADR&gt;FRANCE&lt;/LIBLIG7ADR&gt;
    &lt;/adresse&gt;
    &lt;identeEnfants&gt;
        &lt;UNENFANT&gt;
            &lt;NOMPRENOM&gt;MICHEL CROUTE&lt;/NOMPRENOM&gt;
            &lt;DATNAISS&gt;04032015&lt;/DATNAISS&gt;
            &lt;SEXE&gt;M&lt;/SEXE&gt;
        &lt;/UNENFANT&gt;
        &lt;UNENFANT&gt;
            &lt;NOMPRENOM&gt;MICHELINE CROUTE&lt;/NOMPRENOM&gt;
            &lt;DATNAISS&gt;11022017&lt;/DATNAISS&gt;
            &lt;SEXE&gt;F&lt;/SEXE&gt;
        &lt;/UNENFANT&gt;
    &lt;/identeEnfants&gt;
    &lt;identePersonnes&gt;
        &lt;UNEPERSONNE&gt;
            &lt;QUAL&gt;Madame&lt;/QUAL&gt;
            &lt;NOMPRENOM&gt;JEANNE CROUTE&lt;/NOMPRENOM&gt;
            &lt;DATNAISS&gt;05031988&lt;/DATNAISS&gt;
            &lt;SEXE&gt;F&lt;/SEXE&gt;
        &lt;/UNEPERSONNE&gt;
        &lt;UNEPERSONNE&gt;
            &lt;QUAL&gt;Monsieur&lt;/QUAL&gt;
            &lt;NOMPRENOM&gt;JEAN CROUTE&lt;/NOMPRENOM&gt;
            &lt;DATNAISS&gt;03051989&lt;/DATNAISS&gt;
            &lt;SEXE&gt;M&lt;/SEXE&gt;
        &lt;/UNEPERSONNE&gt;
    &lt;/identePersonnes&gt;
    &lt;quotients&gt;
        &lt;QFMOIS&gt;
            &lt;DUMOIS&gt;5&lt;/DUMOIS&gt;
            &lt;DELANNEE&gt;2021&lt;/DELANNEE&gt;
            &lt;QUOTIENTF&gt;2057&lt;/QUOTIENTF&gt;
        &lt;/QFMOIS&gt;
    &lt;/quotients&gt;
&lt;/drtData&gt;
</fluxRetour><libelleRetour>Votre demande est bien enregistrée. Un document vous sera adressé à votre domicile dans les prochains jours.</libelleRetour></beanRetourDemandeDocumentWeb></return></ns2:demanderDocumentWebResponse></soapenv:Body></soapenv:Envelope>
--MIMEBoundary_0085f52c3f26502144f16811fb6d6544e7f36e41757a5486--
"
`);
  });
});
