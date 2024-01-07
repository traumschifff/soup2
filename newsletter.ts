import { google, sheets_v4 } from 'googleapis';
import { Credentials } from 'google-auth-library';
import { GoogleJsonError } from 'google-auth-library/build/src/auth/oauth2client';
import { sheets } from 'googleapis/build/src/apis/sheets';

class UpdateValues {
  /**
   * Sets values in a range of a spreadsheet.
   *
   * @param spreadsheetId    - Id of the spreadsheet.
   * @param range            - Range of cells of the spreadsheet.
   * @param valueInputOption - Determines how input data should be interpreted.
   * @param values           - List of rows of values to input.
   * @return spreadsheet with updated values
   * @throws Error - if credentials file not found.
   */
  public static async updateValues(
    spreadsheetId: string,
    range: string,
    valueInputOption: string,
    values: Array<Array<Object>>,
  ): Promise<sheets_v4.Schema$UpdateValuesResponse | null> {
    try {
      // Load pre-authorized user credentials from the environment.
      const credentials: Credentials = await google.auth.getClient({
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      // Create the sheets API client
      const sheetsAPI = google.sheets({
        version: 'v4',
        auth: credentials,
      });

      // Updates the values in the specified range.
      const body: sheets_v4.Schema$ValueRange = {
        values: values,
      };

      const result = await sheetsAPI.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: valueInputOption,
        requestBody: body,
      });

      console.log(`${result?.data?.updatedCells} cells updated.`);
      return result?.data;
    } catch (e) {
      // Handle errors appropriately
      if (e instanceof GoogleJsonResponseException) {
        const error: GoogleJsonError = e;
        if (error.code === 404) {
          console.log(`Spreadsheet not found with id '${spreadsheetId}'.`);
        } else {
          throw e;
        }
      } else {
        throw e;
      }
    }

    return null;
  }
}

// Example usage
const spreadsheetId = 'your-spreadsheet-id';
const range = 'Sheet1!A1:B2';
const valueInputOption = 'RAW';
const values: Array<Array<Object>> = [
  ['Value1A', 'Value1B'],
  ['Value2A', 'Value2B'],
];

UpdateValues.updateValues(spreadsheetId, range, valueInputOption, values);
