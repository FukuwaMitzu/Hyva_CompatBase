<?php

namespace Bss\HyvaCompatBase\ViewModel;

use Magento\Framework\View\Asset\Repository;

/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
class BundleFileResolver
{
    protected Repository $assetRepository;

    public function __construct(Repository $assetRepository)
    {
        $this->assetRepository = $assetRepository;
    }

    public function getBundleFileUrl($pattern)
    {
        $moduleRegex = "/(\w+)::(.+)/";
        preg_match($moduleRegex, $pattern, $matches);
        if (count($matches)) {
            $asset = $this->assetRepository->createAsset('rollup/build/' . $matches[1] . "/" . $matches[2]);
            return $asset->getUrl();
        }
    }
}
