import type { SerializedCaption } from '$lib/utils/captions';
import type { PageLoad } from './$types';

import captions from '$lib/captions.json'

export const load: PageLoad = ({ params }) => {
    return { captions }
};
