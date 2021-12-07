<?php

namespace Kirby\Toolkit;

/**
 * Date helper methods
 *
 * @package   Kirby Toolkit
 * @author    Nico Hoffmann <nico@getkirby.com>
 * @link      https://getkirby.com
 * @copyright Bastian Allgeier GmbH
 * @license   https://opensource.org/licenses/MIT
 * @since     3.6.2
 */
class Date
{
    /**
     * Rounds the minutes of the given date
     * by the defined step
     * @since 3.6.2
     *
     * @param string|null $date
     * @param int|array|null $step array of `unit` and `size` to round to nearest
     * @return int|null
     */
    public static function timestamp(?string $date = null, $step = null): ?int
    {
        if (V::date($date) === false) {
            return null;
        }

        $date = strtotime($date);

        if ($step === null) {
            return $date;
        }

        // fallback for pre-3.5.0 usage
        if (is_int($step) === true) {
            $step = [
                'unit' => 'minute',
                'size' => $step
            ];
        }

        if (is_array($step) === false) {
            return $date;
        }

        $parts = [
            'second' => date('s', $date),
            'minute' => date('i', $date),
            'hour'   => date('H', $date),
            'day'    => date('d', $date),
            'month'  => date('m', $date),
            'year'   => date('Y', $date),
        ];

        $current = $parts[$step['unit']];
        $nearest = round($current / $step['size']) * $step['size'];
        $parts[$step['unit']] = $nearest;

        foreach ($parts as $part => $value) {
            if ($part === $step['unit']) {
                break;
            }

            $parts[$part] = 0;
        }

        $timestamp = strtotime(
            $parts['year'] . '-' .
            str_pad($parts['month'], 2, 0, STR_PAD_LEFT) . '-' .
            str_pad($parts['day'], 2, 0, STR_PAD_LEFT) . ' ' .
            str_pad($parts['hour'], 2, 0, STR_PAD_LEFT) . ':' .
            str_pad($parts['minute'], 2, 0, STR_PAD_LEFT) . ':' .
            str_pad($parts['second'], 2, 0, STR_PAD_LEFT)
        );

        // on error, convert `false` into `null`
        return $timestamp ?? null;
    }
}
